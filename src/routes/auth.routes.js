// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Use uma função anônima para chamar os métodos do controller
router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));

module.exports = router;