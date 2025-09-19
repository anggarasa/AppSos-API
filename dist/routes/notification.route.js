"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = __importDefault(require("../controllers/notification.controller"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.get('/', notification_controller_1.default.getUserNotifications);
router.get('/unread-count', notification_controller_1.default.getUnreadCount);
router.put('/:notificationId/read', notification_controller_1.default.markAsRead);
router.put('/mark-all-read', notification_controller_1.default.markAllAsRead);
router.delete('/:notificationId', notification_controller_1.default.deleteNotification);
exports.default = router;
//# sourceMappingURL=notification.route.js.map