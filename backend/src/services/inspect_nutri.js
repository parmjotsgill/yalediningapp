/**
 * Test script to inspect Nutrislice API response
 * Run this to see what data we're actually getting from the API
 */

 const { getMenu } = require('./nutrislice');

 async function inspectNutrisliceResponse() {
   console.log('🔍 Inspecting Nutrislice API Response Structure\n');
   console.log('═══════════════════════════════════════════════\n');
 
   try {
     // Test with Berkeley College lunch for today
     const today = new Date().toISOString().slice(0, 10);
     
     console.log(`📍 Testing: Berkeley College`);
     console.log(`📅 Date: ${today}`);
     console.log(`🍽️  Meal: lunch\n`);
 
     const response = await getMenu({
       locationSlug: 'berkeley-college',
       menuType: 'lunch',
       date: today
     });
 
     console.log('📦 FULL API RESPONSE:');
     console.log('═══════════════════════════════════════════════');
     console.log(JSON.stringify(response, null, 2));
     console.log('\n');
 
     // Analyze structure
     if (response && response.days && response.days.length > 0) {
       const day = response.days[0];
       console.log('📅 FIRST DAY STRUCTURE:');
       console.log('═══════════════════════════════════════════════');
       console.log('Keys:', Object.keys(day));
       console.log('\n');
 
       if (day.menu_items && day.menu_items.length > 0) {
         const firstItem = day.menu_items[0];
         console.log('🍽️  FIRST MENU ITEM STRUCTURE:');
         console.log('═══════════════════════════════════════════════');
         console.log(JSON.stringify(firstItem, null, 2));
         console.log('\n');
 
         console.log('📊 MENU ITEM KEYS:');
         console.log('═══════════════════════════════════════════════');
         console.log(Object.keys(firstItem));
         console.log('\n');
 
         // Check for dietary info
         console.log('🥗 DIETARY INFORMATION FIELDS:');
         console.log('═══════════════════════════════════════════════');
         console.log('food_dietary_preference_names:', firstItem.food_dietary_preference_names);
         console.log('dietary_preferences:', firstItem.dietary_preferences);
         console.log('food.dietary_preferences:', firstItem.food?.dietary_preferences);
         console.log('\n');
 
         // Check for allergen info
         console.log('⚠️  ALLERGEN INFORMATION FIELDS:');
         console.log('═══════════════════════════════════════════════');
         console.log('food_allergen_names:', firstItem.food_allergen_names);
         console.log('allergens:', firstItem.allergens);
         console.log('food.allergens:', firstItem.food?.allergens);
         console.log('\n');
 
         // Check food object structure
         if (firstItem.food) {
           console.log('🍔 FOOD OBJECT STRUCTURE:');
           console.log('═══════════════════════════════════════════════');
           console.log('Food keys:', Object.keys(firstItem.food));
           console.log(JSON.stringify(firstItem.food, null, 2));
           console.log('\n');
         }
 
         // Analyze all items
         console.log('📈 ANALYZING ALL ITEMS:');
         console.log('═══════════════════════════════════════════════');
         console.log(`Total items: ${day.menu_items.length}\n`);
 
         const dietaryFields = new Set();
         const allergenFields = new Set();
 
         day.menu_items.forEach((item, idx) => {
           // Collect all possible dietary field names
           Object.keys(item).forEach(key => {
             if (key.toLowerCase().includes('diet') || key.toLowerCase().includes('preference')) {
               dietaryFields.add(key);
             }
             if (key.toLowerCase().includes('allerg')) {
               allergenFields.add(key);
             }
           });
 
           if (item.food) {
             Object.keys(item.food).forEach(key => {
               if (key.toLowerCase().includes('diet') || key.toLowerCase().includes('preference')) {
                 dietaryFields.add(`food.${key}`);
               }
               if (key.toLowerCase().includes('allerg')) {
                 allergenFields.add(`food.${key}`);
               }
             });
           }
 
           // Show first 3 items with dietary/allergen info
           if (idx < 3 && (item.food_dietary_preference_names || item.dietary_preferences || item.food?.dietary_preferences)) {
             console.log(`\nItem ${idx + 1}: ${item.food?.name || item.name}`);
             console.log('  Dietary tags:', item.food_dietary_preference_names || item.dietary_preferences || item.food?.dietary_preferences);
             console.log('  Allergens:', item.food_allergen_names || item.allergens || item.food?.allergens);
           }
         });
 
         console.log('\n🔑 ALL DIETARY-RELATED FIELDS FOUND:');
         console.log(Array.from(dietaryFields));
 
         console.log('\n🔑 ALL ALLERGEN-RELATED FIELDS FOUND:');
         console.log(Array.from(allergenFields));
       }
     }
 
     console.log('\n✅ Inspection complete!');
     console.log('\nℹ️  Use this information to update the dailyMenuSync.js script');
 
   } catch (error) {
     console.error('\n❌ Error:', error.message);
     console.error(error);
   }
 }
 
 // Run the inspection
 inspectNutrisliceResponse()
   .then(() => {
     console.log('\n✅ Done');
     process.exit(0);
   })
   .catch(err => {
     console.error('\n❌ Failed:', err);
     process.exit(1);
   });