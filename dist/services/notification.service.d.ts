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
    createNotification(data: CreateNotificationData): Promise<({
        post: {
            id: string;
            content: string;
            imageUrl: string | null;
        } | null;
        comment: {
            id: string;
            content: string;
        } | null;
        sender: {
            name: string;
            id: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string | null;
        type: import("../../generated/prisma").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        receiverId: string;
        senderId: string;
        commentId: string | null;
    }) | null>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: ({
            post: {
                id: string;
                content: string;
                imageUrl: string | null;
            } | null;
            comment: {
                id: string;
                content: string;
            } | null;
            sender: {
                name: string;
                id: string;
                username: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string | null;
            type: import("../../generated/prisma").$Enums.NotificationType;
            message: string;
            isRead: boolean;
            receiverId: string;
            senderId: string;
            commentId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUnreadNotificationCount(userId: string): Promise<number>;
    markNotificationAsRead(notificationId: string, userId: string): Promise<boolean>;
    markAllNotificationsAsRead(userId: string): Promise<number>;
    deleteNotification(notificationId: string, userId: string): Promise<boolean>;
    createLikeNotification(postId: string, likerId: string): Promise<({
        post: {
            id: string;
            content: string;
            imageUrl: string | null;
        } | null;
        comment: {
            id: string;
            content: string;
        } | null;
        sender: {
            name: string;
            id: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string | null;
        type: import("../../generated/prisma").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        receiverId: string;
        senderId: string;
        commentId: string | null;
    }) | null>;
    createCommentNotification(commentId: string, commenterId: string): Promise<({
        post: {
            id: string;
            content: string;
            imageUrl: string | null;
        } | null;
        comment: {
            id: string;
            content: string;
        } | null;
        sender: {
            name: string;
            id: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string | null;
        type: import("../../generated/prisma").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        receiverId: string;
        senderId: string;
        commentId: string | null;
    }) | null>;
    createFollowNotification(followerId: string, followingId: string): Promise<({
        post: {
            id: string;
            content: string;
            imageUrl: string | null;
        } | null;
        comment: {
            id: string;
            content: string;
        } | null;
        sender: {
            name: string;
            id: string;
            username: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        postId: string | null;
        type: import("../../generated/prisma").$Enums.NotificationType;
        message: string;
        isRead: boolean;
        receiverId: string;
        senderId: string;
        commentId: string | null;
    }) | null>;
}
declare const _default: NotificationService;
export default _default;
//# sourceMappingURL=notification.service.d.ts.map