/**
 * Test Cron Jobs Script
 * This script runs a test cron that executes every minute
 * Use this to verify your cron setup works before deploying
 */

 require('dotenv').config();
 const { setupTestCron } = require('../src/cron/jobs');
 
 console.log('🧪 Starting Cron Test Mode...');
 console.log('⏰ The cron job will run every minute');
 console.log('👀 Watch for "Hello World!" messages');
 console.log('🛑 Press Ctrl+C to stop');
 console.log('');
 
 // Start the test cron (runs every minute)
 setupTestCron();
 
 console.log('✅ Test cron is now running');
 console.log('⏳ Waiting for first execution (within 1 minute)...\n');
 
 // Keep the process running
 process.stdin.resume();