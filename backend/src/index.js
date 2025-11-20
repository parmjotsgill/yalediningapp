require('dotenv').config(); // Load env first

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const routes = require('./routes');
const db = require('./db/connection');
const { setupCronJobs, setupTestCron } = require('./cron/jobs');

const app = express();
const PORT = process.env.PORT || 4000;

// Security & perf
app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());

// Body parsing
app.use(express.json());

// CORS (add any other frontend origins you use)
const allowedOrigins = [
  'https://eatyale.io',
  // 'https://palegoldenrod-cassowary-131857.hostingersite.com',
  // 'https://your-frontend-preview.onrender.com'
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.use('/api', routes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'YalDiningApp backend is running',
    status: 'online',
    database: 'connected',
    cronMode: process.env.CRON_MODE || 'disabled',
    endpoints: { dining: '/api/dining', halls: '/api/dining/halls' }
  });
});

// Health check
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

// Cron init
const cronMode = process.env.CRON_MODE;
if (cronMode === 'test') {
  console.log('🧪 Starting in TEST mode - cron runs every minute');
  setupTestCron();
} else if (cronMode === 'production') {
  console.log('🚀 Starting in PRODUCTION mode - cron runs at 1 AM daily');
  setupCronJobs();
} else {
  console.log('⏸️  Cron jobs disabled (set CRON_MODE=test or CRON_MODE=production)');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM: closing DB pool');
  await db.closePool();
  process.exit(0);
});
process.on('SIGINT', async () => {
  console.log('SIGINT: closing DB pool');
  await db.closePool();
  process.exit(0);
});

// Start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║   YalDiningApp Backend Server          ║
╠════════════════════════════════════════╣
║   🚀 Port: ${PORT}                         
║   🗄️  Database: ${process.env.DB_NAME || 'MySQL'}
║   📡 API: /api                         
║   ❤️  Health: /health                  
║   ⏰ Cron: ${cronMode || 'disabled'}                    
╚════════════════════════════════════════╝
`);
});

module.exports = app;
