/**
 * MySQL Database Configuration
 * Reads credentials from .env file for security
 */

 require('dotenv').config();

 module.exports = {
   // Database connection settings
   host: process.env.DB_HOST || 'srv1537.hstgr.io',
   port: process.env.DB_PORT || 3306,
   user: process.env.DB_USER || 'u382494441_sachit',
   password: process.env.DB_PASSWORD || '656TeamPK',
   database: process.env.DB_NAME || 'u382494441_yalediningapp',
   
   // Connection pool settings for better performance
   connectionLimit: 10,           // Max number of connections in pool
   queueLimit: 0,                 // No limit on queued connection requests
   waitForConnections: true,      // Wait if no connections available
   
   // Additional MySQL settings
   charset: 'utf8mb4',            // Support for emojis and special characters
   timezone: 'Z',                 // UTC timezone
   
   // Keep connections alive
   enableKeepAlive: true,
   keepAliveInitialDelay: 0
 };