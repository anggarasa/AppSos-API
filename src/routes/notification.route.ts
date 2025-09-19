import { Router } from 'express';
import notificationController from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Semua route memerlukan autentikasi
router.use(authenticateToken);

// GET /api/notifications - Mendapatkan notifikasi user
router.get('/', notificationController.getUserNotifications);

// GET /api/notifications/unread-count - Mendapatkan jumlah notifikasi yang belum dibaca
router.get('/unread-count', notificationController.getUnreadCount);

// PUT /api/notifications/:notificationId/read - Menandai notifikasi sebagai sudah dibaca
router.put('/:notificationId/read', notificationController.markAsRead);

// PUT /api/notifications/mark-all-read - Menandai semua notifikasi sebagai sudah dibaca
router.put('/mark-all-read', notificationController.markAllAsRead);

// DELETE /api/notifications/:notificationId - Menghapus notifikasi
router.delete('/:notificationId', notificationController.deleteNotification);

export default router;
