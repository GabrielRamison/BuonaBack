// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Rotas protegidas
router.use(authMiddleware);
router.get('/profile', UserController.profile);
router.put('/profile', UserController.update);

module.exports = router;