require('dotenv').config();  // Load environment variables first
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const db = require('./db/connection');  // Import database connection

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
  ╚════════════════════════════════════════╝
  `);
});

module.exports = app;