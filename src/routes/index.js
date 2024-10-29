// src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const wineryRoutes = require('./winery.routes');
const wineRoutes = require('./wine.routes');
const eventRoutes = require('./event.routes');
const bookingRoutes = require('./booking.routes');

router.use('/auth', authRoutes);
router.use('/wineries', wineryRoutes);
router.use('/wines', wineRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router;