
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Parse JSON bodies (for future POST/PUT)
app.use(express.json());
app.use(cors());

// Mount all API routes under /api
app.use('/api', routes);

// Basic root route (optional)
app.get('/', (req, res) => {
  res.send('YalDiningApp backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});