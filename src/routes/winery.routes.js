// src/routes/winery.routes.js
const express = require('express');
const router = express.Router();
const WineryController = require('../controllers/WineryController');
const authMiddleware = require('../middlewares/auth');

router.get('/', WineryController.index);
router.get('/:id', WineryController.show);
router.post('/', authMiddleware, WineryController.store);
router.put('/:id', authMiddleware, WineryController.update);
router.delete('/:id', authMiddleware, WineryController.delete);

module.exports = router;