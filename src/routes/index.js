// src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const wineryRoutes = require('./winery.routes');
const wineRoutes = require('./wine.routes');
const eventRoutes = require('./event.routes');
const bookingRoutes = require('./booking.routes');


router.get('/', (req, res) => {
    res.json({ message: 'API is running' });
  });
router.use('/wineries', wineryRoutes);
router.use('/wines', wineRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/auth', authRoutes);


module.exports = router;