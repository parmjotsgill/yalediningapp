/**
 * Daily Menu Sync Cron Job
 * Fetches menu data from Nutrislice API and updates database
 * Overwrites existing entries for the same date/hall/meal
 */

 const { getMenu } = require('../services/nutrislice');
 const db = require('../db/connection');
 
 // Configuration
 const DAYS_TO_FETCH = 7; // Fetch next 7 days of menus
 
 // Yale residential college dining halls
 const DINING_HALLS = [
   { slug: 'benjamin-franklin-college', name: 'Benjamin Franklin' },
   { slug: 'berkeley-college',          name: 'Berkeley' },
   { slug: 'branford-college',          name: 'Branford' },
   { slug: 'davenport-college',         name: 'Davenport' },
   { slug: 'ezra-stiles-college',       name: 'Ezra Stiles' },
   { slug: 'hopper-college',            name: 'Grace Hopper' },
   { slug: 'jonathan-edwards-college',  name: 'Jonathan Edwards' },
   { slug: 'morse-college',             name: 'Morse' },
   { slug: 'pauli-murray-college',      name: 'Pauli Murray' },
   { slug: 'pierson-college',           name: 'Pierson' },
   { slug: 'saybrook-college',          name: 'Saybrook' },
   { slug: 'silliman-college',          name: 'Silliman' },
   { slug: 'timothy-dwight-college',    name: 'Timothy Dwight' },
   { slug: 'trumbull-college',          name: 'Trumbull' },
 ];
 
 const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];
 
 /**
  * Get next N dates in YYYY-MM-DD format
  */
 function getNextNDates(n) {
   const dates = [];
   const today = new Date();
 
   for (let i = 0; i < n; i++) {
     const d = new Date(today);
     d.setDate(today.getDate() + i);
     const iso = d.toISOString().slice(0, 10);
     dates.push(iso);
   }
 
   return dates;
 }
 
 /**
  * Normalize Nutrislice API response to our format
  */
 function normalizeMeal(nutrisliceData, targetDate) {
   if (!nutrisliceData || !Array.isArray(nutrisliceData.days)) return [];
 
   // Find the day matching the target date
   let day =
     nutrisliceData.days.find(
       (d) =>
         d.date === targetDate ||
         d.dateStr === targetDate ||
         d.fulldate === targetDate
     ) || nutrisliceData.days[0];
 
   if (!day || !Array.isArray(day.menu_items)) return [];
 
   return day.menu_items.map((item) => {
     const food = item.food || {};
     return {
       name: food.name || item.name || 'Unknown item',
       station: item.station || '',
       dietTags:
         item.food_dietary_preference_names ||
         item.dietary_preferences ||
         [],
       allergens:
         item.food_allergen_names ||
         item.allergens ||
         [],
     };
   });
 }
 
 /**
  * Delete existing menu items for a specific date, hall, and meal
  * This allows us to "overwrite" by deleting old data first
  */
 async function deleteExistingMenu(hallId, date, mealType) {
   try {
     const result = await db.query(
       'DELETE FROM menu_items WHERE hall_id = ? AND date = ? AND meal_type = ?',
       [hallId, date, mealType]
     );
     
     return result.affectedRows;
   } catch (error) {
     console.error(`❌ Error deleting menu for hall ${hallId}, ${date}, ${mealType}:`, error.message);
     throw error;
   }
 }
 
 /**
  * Import a single menu item into the database
  */
 async function importMenuItem(hallId, date, mealType, item) {
   const connection = await db.getConnection();
   
   try {
     await connection.beginTransaction();
     
     // Skip "Unknown item" entries
     if (item.name === 'Unknown item' || !item.name) {
       await connection.commit();
       return false;
     }
     
     // Insert menu item
     const [result] = await connection.execute(
       'INSERT INTO menu_items (hall_id, date, meal_type, item_name, station) VALUES (?, ?, ?, ?, ?)',
       [hallId, date, mealType, item.name, item.station || '']
     );
     
     const menuItemId = result.insertId;
     
     // Insert dietary tags
     if (item.dietTags && item.dietTags.length > 0) {
       for (const tag of item.dietTags) {
         if (!tag) continue;
         
         await connection.execute(
           'INSERT IGNORE INTO dietary_tags (tag_name) VALUES (?)',
           [tag]
         );
         
         const [tagRows] = await connection.execute(
           'SELECT id FROM dietary_tags WHERE tag_name = ?',
           [tag]
         );
         
         if (tagRows.length > 0) {
           await connection.execute(
             'INSERT IGNORE INTO menu_item_dietary_tags (menu_item_id, dietary_tag_id) VALUES (?, ?)',
             [menuItemId, tagRows[0].id]
           );
         }
       }
     }
     
     // Insert allergens
     if (item.allergens && item.allergens.length > 0) {
       for (const allergen of item.allergens) {
         if (!allergen) continue;
         
         await connection.execute(
           'INSERT IGNORE INTO allergens (allergen_name) VALUES (?)',
           [allergen]
         );
         
         const [allergenRows] = await connection.execute(
           'SELECT id FROM allergens WHERE allergen_name = ?',
           [allergen]
         );
         
         if (allergenRows.length > 0) {
           await connection.execute(
             'INSERT IGNORE INTO menu_item_allergens (menu_item_id, allergen_id) VALUES (?, ?)',
             [menuItemId, allergenRows[0].id]
           );
         }
       }
     }
     
     await connection.commit();
     return true;
     
   } catch (err) {
     await connection.rollback();
     throw err;
   } finally {
     connection.release();
   }
 }
 
 /**
  * Fetch and sync menu for one meal (breakfast, lunch, or dinner)
  */
 async function syncMeal(hallId, hallSlug, date, mealType) {
   try {
     // Fetch from Nutrislice API
     const nutrisliceData = await getMenu({
       locationSlug: hallSlug,
       menuType: mealType,
       date
     });
 
     // Normalize the data
     const items = normalizeMeal(nutrisliceData, date);
 
     if (items.length === 0) {
       console.log(`    ⏩ No ${mealType} items from API`);
       return { imported: 0, skipped: 0, deleted: 0 };
     }
 
     // Delete existing entries (this is the "overwrite")
     const deleted = await deleteExistingMenu(hallId, date, mealType);
     
     if (deleted > 0) {
       console.log(`    🗑️  Deleted ${deleted} old ${mealType} items`);
     }
     
     // Insert new entries
     let imported = 0;
     let skipped = 0;
     
     for (const item of items) {
       try {
         const success = await importMenuItem(hallId, date, mealType, item);
         if (success) {
           imported++;
         } else {
           skipped++;
         }
       } catch (err) {
         console.error(`    ❌ Error importing "${item.name}":`, err.message);
         skipped++;
       }
     }
     
     console.log(`    ✅ ${mealType}: ${imported} imported, ${skipped} skipped`);
     
     return { imported, skipped, deleted };
     
   } catch (error) {
     console.error(`    ❌ Error syncing ${mealType}:`, error.message);
     return { imported: 0, skipped: 0, deleted: 0 };
   }
 }
 
 /**
  * Main sync function - this runs every day
  */
 async function dailyMenuSync() {
   console.log('\n╔════════════════════════════════════════╗');
   console.log('║     Daily Menu Sync Started            ║');
   console.log('╚════════════════════════════════════════╝\n');
   console.log(`🕐 Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}\n`);
   
   let totalImported = 0;
   let totalSkipped = 0;
   let totalDeleted = 0;
   
   try {
     const dates = getNextNDates(DAYS_TO_FETCH);
     console.log(`📅 Syncing ${DAYS_TO_FETCH} days of menus for ${DINING_HALLS.length} halls\n`);
     
     // Process each hall
     for (const hall of DINING_HALLS) {
       console.log(`📍 ${hall.name} (${hall.slug})`);
       
       // Get hall ID from database
       const hallRows = await db.query(
         'SELECT id FROM dining_halls WHERE slug = ?',
         [hall.slug]
       );
       //console.log('hallRows',hallRows)
       //console.log('hallRows length',hallRows.length)
       //console.log('hallRows slug',hallRows.slug)
       if (hallRows.length === 0) {
         console.log(`  ⚠️  Hall not found in database: ${hall.slug}\n`);
         continue;
       }
       
       const hallId = hallRows[0].id;
       
       // Process each date
       for (const date of dates) {
         console.log(`  📅 ${date}`);
         
         // Process each meal
         for (const mealType of MEAL_TYPES) {
           const stats = await syncMeal(hallId, hall.slug, date, mealType);
           totalImported += stats.imported;
           totalSkipped += stats.skipped;
           totalDeleted += stats.deleted;
         }
       }
       
       console.log(''); // Empty line between halls
     }
     
     console.log('╔════════════════════════════════════════╗');
     console.log('║     Daily Menu Sync Complete           ║');
     console.log('╚════════════════════════════════════════╝');
     console.log(`✅ Total imported: ${totalImported}`);
     console.log(`🗑️  Total deleted: ${totalDeleted}`);
     console.log(`⏩ Total skipped: ${totalSkipped}`);
     console.log(`🕐 Completed: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}\n`);
     
   } catch (error) {
     console.error('\n❌ Daily sync failed:', error.message);
     console.error(error);
     throw error;
   }
 }
 
 /**
  * Cleanup old menu data (optional - keeps database lean)
  * Delete menus older than 7 days
  */
 async function cleanupOldMenus() {
   try {
     console.log('🧹 Cleaning up old menu data...');
     
     const sevenDaysAgo = new Date();
     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
     const dateStr = sevenDaysAgo.toISOString().slice(0, 10);
     
     const result = await db.query(
       'DELETE FROM menu_items WHERE date < ?',
       [dateStr]
     );
     
     console.log(`✅ Deleted ${result.affectedRows} old menu items (before ${dateStr})\n`);
     
   } catch (error) {
     console.error('❌ Cleanup failed:', error.message);
   }
 }
 
 // Export for use in other files
 module.exports = {
   dailyMenuSync,
   cleanupOldMenus,
   syncMeal
 };
 
 // If running this script directly (for testing)
 if (require.main === module) {
   dailyMenuSync()
     .then(async () => {
       // Optional: cleanup old data after sync
       await cleanupOldMenus();
       
       console.log('✅ Script completed successfully');
       process.exit(0);
     })
     .catch((err) => {
       console.error('❌ Script failed:', err);
       process.exit(1);
     });
 }