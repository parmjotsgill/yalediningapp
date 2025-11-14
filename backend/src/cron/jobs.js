
const cron = require('node-cron');

/**
 * Daily job that runs at 1:00 AM every day
 * Cron format: minute hour day month weekday
 * '0 1 * * *' means: minute 0, hour 1, every day, every month, every weekday
 */
function setupCronJobs() {
  // Job 1: Daily 1 AM task
  cron.schedule('0 1 * * *', () => {
    const now = new Date();
    console.log('Hello World!');
    console.log(`Cron job executed at: ${now.toLocaleString()}`);
  }, {
    scheduled: true,
    timezone: "America/New_York"  // Eastern Time (Yale's timezone)
  });

  console.log('✅ Cron jobs initialized');
  console.log('📅 Daily task scheduled for 1:00 AM Eastern Time');
}

// For testing: Run every minute (uncomment to test)
function setupTestCron() {
  cron.schedule('* * * * *', () => {
    const now = new Date();
    console.log('🧪 TEST - Hello World!');
    console.log(`Test cron executed at: ${now.toLocaleString()}`);
  }, {
    scheduled: true,
    timezone: "America/New_York"
  });

  console.log('🧪 TEST MODE: Cron job running every minute');
}

module.exports = {
  setupCronJobs,
  setupTestCron
};
