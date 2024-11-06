// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');
const authController = require('../controllers/AuthController');



// Use uma função anônima para chamar os métodos do controller
router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));
router.put('/promote/:userId', authMiddleware, isAdmin, authController.promoteToAdmin);
// ROTA TEMPORÁRIA - REMOVA APÓS O USO!
router.post('/reset-admin', (req, res) => AuthController.resetAdminPassword(req, res));

router.post('/test-password', AuthController.testPassword);

router.post('/diagnostic', AuthController.diagnosticLogin);

module.exports = router;