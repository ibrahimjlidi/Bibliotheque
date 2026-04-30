const express = require('express');
const router = express.Router();
const notificationController = require('../controller/NotificationController');
const { auth, authorize } = require('../middelweras/authMiddleware');  // تأكد من مسار الملف

router.post('/', auth, authorize(['employe', 'admin']), notificationController.createNotification);

router.get('/', auth, authorize(['employe', 'admin']), notificationController.getAllNotifications);

router.get('/:id', auth, authorize(['employe', 'admin']), notificationController.getNotificationById);

router.put('/:id', auth, authorize(['employe', 'admin']), notificationController.updateNotification);

router.delete('/:id', auth, authorize(['employe', 'admin']), notificationController.deleteNotification);

module.exports = router;