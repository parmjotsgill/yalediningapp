/**
 * Daily Menu Sync Cron Job - CORRECTED FOR ACTUAL API STRUCTURE
 * Based on real Nutrislice API response analysis
 * 
 * KEY FINDING: Dietary tags are in food.icons.food_icons array!
 * Each food_icon has: { name: "Vegan", slug: "vegan", type: 1, ... }
 */

 const { getMenu } = require('../services/nutrislice');
 const db = require('../db/connection');
 
 // Configuration
 const DAYS_TO_FETCH = 7;
 
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
      
      // Get local date in YYYY-MM-DD format (avoiding UTC timezone issues)
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const iso = `${year}-${month}-${day}`;
      
      dates.push(iso);
    }
  
    return dates;
  }
 
 /**
  * Extract dietary tags from food.icons.food_icons
  * CORRECTED: Based on actual API structure
  */
 function extractDietaryTags(item) {
   const tags = [];
   
   if (!item.food || !item.food.icons || !item.food.icons.food_icons) {
     return tags;
   }
   
   const foodIcons = item.food.icons.food_icons;
   
   if (!Array.isArray(foodIcons)) {
     return tags;
   }
   
   // Extract dietary preference icons
   foodIcons.forEach(icon => {
     if (icon && icon.name && icon.name.trim()) {
       // Common dietary tags from Yale's system:
       // "Vegan", "Vegetarian", "Gluten Free", "Halal", "Kosher", etc.
       tags.push(icon.name.trim());
     }
   });
   
   return [...new Set(tags)]; // Remove duplicates
 }
 
 /**
  * Extract allergens from food.icons.food_icons
  * CORRECTED: Based on actual API structure
  * Note: Allergens are also in food_icons but with type=1 and behavior=1
  */
 function extractAllergens(item) {
   const allergens = [];
   
   if (!item.food || !item.food.icons || !item.food.icons.food_icons) {
     return allergens;
   }
   
   const foodIcons = item.food.icons.food_icons;
   
   if (!Array.isArray(foodIcons)) {
     return allergens;
   }
   
   // Extract allergen icons (these are marked with is_filter: true typically)
   // Common allergens: "Dairy", "Eggs", "Fish", "Shellfish", "Tree Nuts", "Peanuts", "Wheat", "Soybeans"
   foodIcons.forEach(icon => {
     if (icon && icon.name && icon.name.trim()) {
       const name = icon.name.trim();
       
       // Check if this is an allergen (common allergen names)
       const isAllergen = [
         'dairy', 'milk', 'eggs', 'egg', 'fish', 'shellfish', 
         'tree nuts', 'peanuts', 'peanut', 'wheat', 'soybeans', 'soy',
         'sesame', 'gluten'
       ].some(allergen => name.toLowerCase().includes(allergen));
       
       if (isAllergen) {
         allergens.push(name);
       }
     }
   });
   
   return [...new Set(allergens)]; // Remove duplicates
 }
 
 /**
  * Get station name from item
  */
 function getStationName(menuItems, item) {
   // Find the most recent station header before this item
   const itemPosition = item.position;
   let stationName = '';
   
   for (let i = menuItems.length - 1; i >= 0; i--) {
     const mi = menuItems[i];
     if (mi.position < itemPosition && mi.is_station_header && mi.text) {
       stationName = mi.text;
       break;
     }
   }
   
   return stationName;
 }
 
 /**
  * Normalize Nutrislice API response to our format
  * CORRECTED: Based on actual API structure
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
 
   const menuItems = day.menu_items;
   const items = [];
 
   menuItems.forEach((item, index) => {
     // Skip station headers and non-food items
     if (item.is_station_header || item.is_section_title || !item.food) {
       return;
     }
 
     const food = item.food;
     
     // Extract dietary tags and allergens from food.icons.food_icons
     const dietTags = extractDietaryTags(item);
     const allergens = extractAllergens(item);
     
     // Get station name
     const stationName = getStationName(menuItems.slice(0, index + 1), item);
     
     items.push({
       name: food.name || 'Unknown item',
       station: stationName || '',
       dietTags: dietTags,
       allergens: allergens,
     });
   });
 
   return items;
 }
 
 /**
  * Delete existing menu items for a specific date, hall, and meal
  */
 async function deleteExistingMenu(hallId, date, mealType) {
   try {
     const result = await db.query(
       'DELETE FROM menu_items WHERE hall_id = ? AND date = ? AND meal_type = ?',
       [hallId, date, mealType]
     );
     
     return result.affectedRows || 0;
   } catch (error) {
     console.error(`❌ Error deleting menu for hall ${hallId}, ${date}, ${mealType}:`, error.message);
     throw error;
   }
 }
 
 /**
  * Get or create a dietary tag, return its ID
  */
 async function getOrCreateDietaryTag(connection, tagName) {
   if (!tagName || !tagName.trim()) return null;
   
   const cleanTag = tagName.trim();
   
   try {
     // Insert if not exists
     await connection.execute(
       'INSERT IGNORE INTO dietary_tags (tag_name) VALUES (?)',
       [cleanTag]
     );
     
     // Get the ID
     const [rows] = await connection.execute(
       'SELECT id FROM dietary_tags WHERE tag_name = ?',
       [cleanTag]
     );
     
     return rows.length > 0 ? rows[0].id : null;
   } catch (error) {
     console.error(`Error with dietary tag "${cleanTag}":`, error.message);
     return null;
   }
 }
 
 /**
  * Get or create an allergen, return its ID
  */
 async function getOrCreateAllergen(connection, allergenName) {
   if (!allergenName || !allergenName.trim()) return null;
   
   const cleanAllergen = allergenName.trim();
   
   try {
     // Insert if not exists
     await connection.execute(
       'INSERT IGNORE INTO allergens (allergen_name) VALUES (?)',
       [cleanAllergen]
     );
     
     // Get the ID
     const [rows] = await connection.execute(
       'SELECT id FROM allergens WHERE allergen_name = ?',
       [cleanAllergen]
     );
     
     return rows.length > 0 ? rows[0].id : null;
   } catch (error) {
     console.error(`Error with allergen "${cleanAllergen}":`, error.message);
     return null;
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
       return { success: false, reason: 'unknown' };
     }
     
     // Insert menu item
     const [result] = await connection.execute(
       'INSERT INTO menu_items (hall_id, date, meal_type, item_name, station) VALUES (?, ?, ?, ?, ?)',
       [hallId, date, mealType, item.name, item.station || '']
     );
     
     const menuItemId = result.insertId;
     
     let dietTagsAdded = 0;
     let allergensAdded = 0;
     
     // Insert dietary tags
     if (item.dietTags && item.dietTags.length > 0) {
       for (const tag of item.dietTags) {
         const tagId = await getOrCreateDietaryTag(connection, tag);
         if (tagId) {
           try {
             await connection.execute(
               'INSERT IGNORE INTO menu_item_dietary_tags (menu_item_id, dietary_tag_id) VALUES (?, ?)',
               [menuItemId, tagId]
             );
             dietTagsAdded++;
           } catch (err) {
             console.error(`    ⚠️  Error linking dietary tag "${tag}":`, err.message);
           }
         }
       }
     }
     
     // Insert allergens
     if (item.allergens && item.allergens.length > 0) {
       for (const allergen of item.allergens) {
         const allergenId = await getOrCreateAllergen(connection, allergen);
         if (allergenId) {
           try {
             await connection.execute(
               'INSERT IGNORE INTO menu_item_allergens (menu_item_id, allergen_id) VALUES (?, ?)',
               [menuItemId, allergenId]
             );
             allergensAdded++;
           } catch (err) {
             console.error(`    ⚠️  Error linking allergen "${allergen}":`, err.message);
           }
         }
       }
     }
     
     await connection.commit();
     return { 
       success: true, 
       dietTagsAdded, 
       allergensAdded,
       itemName: item.name 
     };
     
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
       return { imported: 0, skipped: 0, deleted: 0, dietTags: 0, allergens: 0 };
     }
 
     // Delete existing entries
     const deleted = await deleteExistingMenu(hallId, date, mealType);
     
     if (deleted > 0) {
       console.log(`    🗑️  Deleted ${deleted} old ${mealType} items`);
     }
     
     // Insert new entries
     let imported = 0;
     let skipped = 0;
     let totalDietTags = 0;
     let totalAllergens = 0;
     
     for (const item of items) {
       try {
         const result = await importMenuItem(hallId, date, mealType, item);
         if (result.success) {
           imported++;
           totalDietTags += result.dietTagsAdded;
           totalAllergens += result.allergensAdded;
           
           // Log items with dietary info (sample - first 3)
           if ((result.dietTagsAdded > 0 || result.allergensAdded > 0) && imported <= 3) {
             console.log(`      ✓ ${result.itemName}: ${result.dietTagsAdded} tags, ${result.allergensAdded} allergens`);
           }
         } else {
           skipped++;
         }
       } catch (err) {
         console.error(`    ❌ Error importing "${item.name}":`, err.message);
         skipped++;
       }
     }
     
     console.log(`    ✅ ${mealType}: ${imported} items, ${totalDietTags} diet tags, ${totalAllergens} allergens`);
     
     return { imported, skipped, deleted, dietTags: totalDietTags, allergens: totalAllergens };
     
   } catch (error) {
     console.error(`    ❌ Error syncing ${mealType}:`, error.message);
     return { imported: 0, skipped: 0, deleted: 0, dietTags: 0, allergens: 0 };
   }
 }
 
 /**
  * Main sync function
  */
 async function dailyMenuSync() {
   console.log('\n╔════════════════════════════════════════╗');
   console.log('║     Daily Menu Sync Started            ║');
   console.log('╚════════════════════════════════════════╝\n');
   console.log(`🕐 Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}\n`);
   
   let totalImported = 0;
   let totalSkipped = 0;
   let totalDeleted = 0;
   let totalDietTags = 0;
   let totalAllergens = 0;
   
   try {
     const dates = getNextNDates(DAYS_TO_FETCH);
     console.log(`📅 Syncing ${DAYS_TO_FETCH} days of menus for ${DINING_HALLS.length} halls\n`);
     
     for (const hall of DINING_HALLS) {
       console.log(`📍 ${hall.name} (${hall.slug})`);
       
       const hallRows = await db.query(
         'SELECT id FROM dining_halls WHERE slug = ?',
         [hall.slug]
       );
       
       if (hallRows.length === 0) {
         console.log(`  ⚠️  Hall not found in database: ${hall.slug}\n`);
         continue;
       }
       
       const hallId = hallRows[0].id;
       
       for (const date of dates) {
         console.log(`  📅 ${date}`);
         
         for (const mealType of MEAL_TYPES) {
           const stats = await syncMeal(hallId, hall.slug, date, mealType);
           totalImported += stats.imported;
           totalSkipped += stats.skipped;
           totalDeleted += stats.deleted;
           totalDietTags += stats.dietTags;
           totalAllergens += stats.allergens;
         }
       }
       
       console.log('');
     }
     
     console.log('╔════════════════════════════════════════╗');
     console.log('║     Daily Menu Sync Complete           ║');
     console.log('╚════════════════════════════════════════╝');
     console.log(`✅ Total imported: ${totalImported} items`);
     console.log(`🥗 Total dietary tags: ${totalDietTags}`);
     console.log(`⚠️  Total allergens: ${totalAllergens}`);
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
  * Cleanup old menu data
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
     
     console.log(`✅ Deleted ${result.affectedRows || 0} old menu items (before ${dateStr})\n`);
     
   } catch (error) {
     console.error('❌ Cleanup failed:', error.message);
   }
 }
 
 module.exports = {
   dailyMenuSync,
   cleanupOldMenus,
   syncMeal
 };
 
 if (require.main === module) {
   dailyMenuSync()
     .then(async () => {
       await cleanupOldMenus();
       console.log('✅ Script completed successfully');
       process.exit(0);
     })
     .catch((err) => {
       console.error('❌ Script failed:', err);
       process.exit(1);
     });
 }