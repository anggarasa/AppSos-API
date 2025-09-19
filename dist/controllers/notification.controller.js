"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_service_1 = __importDefault(require("../services/notification.service"));
class NotificationController {
    async getUserNotifications(req, res) {
        try {
            const userId = req.user?.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                });
            }
            const result = await notification_service_1.default.getUserNotifications(userId, page, limit);
            return res.status(200).json({
                success: true,
                message: 'Notifications retrieved successfully',
                data: result,
            });
        }
        catch (error) {
            console.error('Error in getUserNotifications:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    async getUnreadCount(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                });
            }
            const count = await notification_service_1.default.getUnreadNotificationCount(userId);
            return res.status(200).json({
                success: true,
                message: 'Unread count retrieved successfully',
                data: {
                    unreadCount: count,
                },
            });
        }
        catch (error) {
            console.error('Error in getUnreadCount:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    async markAsRead(req, res) {
        try {
            const userId = req.user?.id;
            const { notificationId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                });
            }
            if (!notificationId) {
                return res.status(400).json({
                    success: false,
                    message: 'Notification ID is required',
                });
            }
            const success = await notification_service_1.default.markNotificationAsRead(notificationId, userId);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found or not authorized',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Notification marked as read',
            });
        }
        catch (error) {
            console.error('Error in markAsRead:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    async markAllAsRead(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                });
            }
            const count = await notification_service_1.default.markAllNotificationsAsRead(userId);
            return res.status(200).json({
                success: true,
                message: 'All notifications marked as read',
                data: {
                    updatedCount: count,
                },
            });
        }
        catch (error) {
            console.error('Error in markAllAsRead:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
    async deleteNotification(req, res) {
        try {
            const userId = req.user?.id;
            const { notificationId } = req.params;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                });
            }
            if (!notificationId) {
                return res.status(400).json({
                    success: false,
                    message: 'Notification ID is required',
                });
            }
            const success = await notification_service_1.default.deleteNotification(notificationId, userId);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found or not authorized',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Notification deleted successfully',
            });
        }
        catch (error) {
            console.error('Error in deleteNotification:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }
}
exports.default = new NotificationController();
//# sourceMappingURL=notification.controller.js.map