// src/routes/wine.routes.js
const express = require('express');
const router = express.Router();
const WineController = require('../controllers/WineController');
const authMiddleware = require('../middlewares/auth');

router.get('/', WineController.index);
router.get('/:id', WineController.show);
router.post('/', authMiddleware, WineController.store);
router.put('/:id', authMiddleware, WineController.update);
router.delete('/:id', authMiddleware, WineController.delete);

module.exports = router;