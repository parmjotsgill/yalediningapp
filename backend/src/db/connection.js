/**
 * MySQL Database Connection Pool
 * Uses mysql2/promise for async/await support
 */

 const mysql = require('mysql2/promise');
 const dbConfig = require('./config');
 
 // Create connection pool
 const pool = mysql.createPool(dbConfig);
 
 /**
  * Test database connection
  */
 async function testConnection() {
   try {
     const connection = await pool.getConnection();
     console.log('✅ Database connected successfully');
     connection.release();
     return true;
   } catch (err) {
     console.error('❌ Database connection failed:', err.message);
     return false;
   }
 }
 
 /**
  * Execute a query with parameters
  * @param {string} sql - SQL query
  * @param {array} params - Query parameters
  * @returns {Promise<array>} Query results
  */
 async function query(sql, params = []) {
   try {
     const [rows] = await pool.execute(sql, params);
     return rows;
   } catch (err) {
     console.error('Query error:', err.message);
     throw err;
   }
 }
 
 /**
  * Get a connection from the pool for transactions
  * @returns {Promise<Connection>}
  */
 async function getConnection() {
   return await pool.getConnection();
 }
 
 /**
  * Close the connection pool
  */
 async function closePool() {
   try {
     await pool.end();
     console.log('Database pool closed');
   } catch (err) {
     console.error('Error closing pool:', err.message);
   }
 }
 
 // Test connection on module load
 testConnection();
 
 module.exports = {
   pool,
   query,
   getConnection,
   closePool,
   testConnection
 };