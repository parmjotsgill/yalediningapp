require('dotenv').config();  // Load environment variables first
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const db = require('./db/connection');  // Import database connection
const { setupCronJobs, setupTestCron } = require('./cron/jobs');  // Import cron jobs

const app = express();
const PORT = process.env.PORT || 4000;

// Parse JSON bodies (for future POST/PUT)
app.use(express.json());
app.use(cors());

// Mount all API routes under /api
app.use('/api', routes);

// Basic root route (optional)
app.get('/', (req, res) => {
  res.json({
    message: 'YalDiningApp backend is running',
    status: 'online',
    database: 'connected',
    cronMode: process.env.CRON_MODE || 'disabled',
    endpoints: {
      dining: '/api/dining',
      halls: '/api/dining/halls'
    }
  });
});

// Health check endpoint to verify database connection
app.get('/health', async (req, res) => {
  try {
    await db.testConnection();
    res.json({ 
      status: 'healthy',
      database: 'connected',
      cronMode: process.env.CRON_MODE || 'disabled',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message 
    });
  }
});

// Initialize cron jobs based on CRON_MODE environment variable
const cronMode = process.env.CRON_MODE;
if (cronMode === 'test') {
  console.log('🧪 Starting in TEST mode - cron runs every minute');
  setupTestCron();
} else if (cronMode === 'production') {
  console.log('🚀 Starting in PRODUCTION mode - cron runs at 1 AM daily');
  setupCronJobs();
} else {
  console.log('⏸️  Cron jobs disabled (set CRON_MODE=test or CRON_MODE=production in .env)');
}

// Graceful shutdown - close database connections when server stops
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server and database connections');
  await db.closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server and database connections');
  await db.closePool();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   YalDiningApp Backend Server          ║
  ╠════════════════════════════════════════╣
  ║   🚀 Server running on port ${PORT}       ║
  ║   🗄️  Database: ${process.env.DB_NAME || 'MySQL'}
  ║   📡 API available at /api             ║
  ║   ❤️  Health check at /health          ║
  ║   ⏰ Cron mode: ${cronMode || 'disabled'}             ║
  ╚════════════════════════════════════════╝
  `);
});

module.exports = app;