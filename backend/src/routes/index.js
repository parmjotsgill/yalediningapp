const express = require('express');
const diningRoutes = require('./dining');

const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/dining', diningRoutes);

module.exports = router;