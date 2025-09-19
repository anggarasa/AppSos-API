type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW';
export interface CreateNotificationData {
    type: NotificationType;
    message: string;
    receiverId: string;
    senderId: string;
    postId?: string;
    commentId?: string;
}
export interface NotificationWithDetails {
    id: string;
    type: NotificationType;
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    sender: {
        id: string;
        username: string;
        name: string;
        avatarUrl: string | null;
    };
    post?: {
        id: string;
        content: string;
        imageUrl: string | null;
    };
    comment?: {
        id: string;
        content: string;
    };
}
declare class NotificationService {
    createNotification(data: CreateNotificationData): Promise<any>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getUnreadNotificationCount(userId: string): Promise<any>;
    markNotificationAsRead(notificationId: string, userId: string): Promise<boolean>;
    markAllNotificationsAsRead(userId: string): Promise<any>;
    deleteNotification(notificationId: string, userId: string): Promise<boolean>;
    createLikeNotification(postId: string, likerId: string): Promise<any>;
    createCommentNotification(commentId: string, commenterId: string): Promise<any>;
    createFollowNotification(followerId: string, followingId: string): Promise<any>;
}
declare const _default: NotificationService;
export default _default;
//# sourceMappingURL=notification.service.d.ts.map