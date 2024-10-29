// src/routes/event.routes.js
const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const authMiddleware = require('../middlewares/auth');

router.get('/', EventController.index);
router.get('/:id', EventController.show);
router.post('/', authMiddleware, EventController.store);
router.put('/:id', authMiddleware, EventController.update);
router.delete('/:id', authMiddleware, EventController.delete);

module.exports = router;