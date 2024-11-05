// src/routes/winery.routes.js
const express = require('express');
const router = express.Router();
const WineryController = require('../controllers/WineryController');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas
router.get('/', WineryController.index.bind(WineryController));
router.get('/:id', WineryController.show.bind(WineryController));

// Rotas protegidas
router.post('/', authMiddleware, WineryController.store.bind(WineryController));
router.put('/:id', authMiddleware, WineryController.update.bind(WineryController));
router.delete('/:id', authMiddleware, WineryController.delete.bind(WineryController));

module.exports = router;