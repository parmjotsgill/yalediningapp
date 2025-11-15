/**
 * Cron Jobs Configuration
 * Scheduled tasks for the Yale Dining App
 */

 const cron = require('node-cron');
 const { dailyMenuSync, cleanupOldMenus } = require('./dailyMenuSync');
 
 /**
  * Production: Daily menu sync at 1:00 AM
  * Fetches fresh menu data from API and updates database
  */
 function setupCronJobs() {
   // Main job: Sync menus every day at 1 AM
   cron.schedule('0 1 * * *', async () => {
     const now = new Date();
     console.log('\n' + '='.repeat(50));
     console.log(`🌅 Daily Menu Sync Triggered`);
     console.log(`⏰ Time: ${now.toLocaleString()}`);
     console.log('='.repeat(50) + '\n');
     
     try {
       await dailyMenuSync();
       
       // Optional: Clean up old menus after sync
       await cleanupOldMenus();
       
       console.log('\n✅ Cron job completed successfully\n');
     } catch (error) {
       console.error('\n❌ Cron job failed:', error.message);
       // In production, you might want to send an alert here
       // e.g., send email, Slack notification, etc.
     }
   }, {
     scheduled: true,
     timezone: "America/New_York"  // Eastern Time (Yale's timezone)
   });
 
   console.log('✅ Cron jobs initialized');
   console.log('📅 Daily menu sync scheduled for 1:00 AM Eastern Time');
 }
 
 /**
  * Test mode: Runs every minute for testing
  */
 function setupTestCron() {
   cron.schedule('* * * * *', async () => {
     const now = new Date();
     console.log('\n🧪 TEST - Menu Sync Triggered');
     console.log(`⏰ Time: ${now.toLocaleString()}\n`);
     
     try {
       await dailyMenuSync();
       console.log('\n✅ TEST - Sync completed\n');
     } catch (error) {
       console.error('\n❌ TEST - Sync failed:', error.message);
     }
   }, {
     scheduled: true,
     timezone: "America/New_York"
   });
 
   console.log('🧪 TEST MODE: Menu sync running every minute');
 }
 
 module.exports = {
   setupCronJobs,
   setupTestCron
 };