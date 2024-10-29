// src/routes/booking.routes.js
const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware); // Todas as rotas de agendamento requerem autenticação

router.get('/', BookingController.index);
router.get('/availability', BookingController.checkAvailability);
router.get('/:id', BookingController.show);
router.post('/', BookingController.store);
router.put('/:id', BookingController.update);
router.post('/:id/cancel', BookingController.cancel);


module.exports = router;