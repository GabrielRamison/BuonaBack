// src/routes/message.routes.js
const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/wineries/:winery_id/messages', MessageController.index);
router.post('/wineries/:winery_id/messages', MessageController.store);
router.patch('/wineries/:winery_id/messages/read', MessageController.markAsRead);
router.get('/wineries/:winery_id/messages/unread', MessageController.getUnreadCount);

module.exports = router;