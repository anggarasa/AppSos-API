import { PrismaClient } from '../../generated/prisma';

type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW';

const prisma = new PrismaClient();

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

class NotificationService {
  async createNotification(data: CreateNotificationData) {
    try {
      // Jangan buat notifikasi jika user mengirim ke dirinya sendiri
      if (data.receiverId === data.senderId) {
        return null;
      }

      const notification = await prisma.notification.create({
        data: {
          type: data.type,
          message: data.message,
          receiverId: data.receiverId,
          senderId: data.senderId,
          postId: data.postId,
          commentId: data.commentId,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
              imageUrl: true,
            },
          },
          comment: {
            select: {
              id: true,
              content: true,
            },
          },
        },
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;

      const notifications = await prisma.notification.findMany({
        where: {
          receiverId: userId,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
              imageUrl: true,
            },
          },
          comment: {
            select: {
              id: true,
              content: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      const total = await prisma.notification.count({
        where: {
          receiverId: userId,
        },
      });

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  async getUnreadNotificationCount(userId: string) {
    try {
      const count = await prisma.notification.count({
        where: {
          receiverId: userId,
          isRead: false,
        },
      });

      return count;
    } catch (error) {
      console.error('Error getting unread notification count:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    try {
      const notification = await prisma.notification.updateMany({
        where: {
          id: notificationId,
          receiverId: userId,
        },
        data: {
          isRead: true,
        },
      });

      return notification.count > 0;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId: string) {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          receiverId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return result.count;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string, userId: string) {
    try {
      const notification = await prisma.notification.deleteMany({
        where: {
          id: notificationId,
          receiverId: userId,
        },
      });

      return notification.count > 0;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Helper methods untuk membuat notifikasi berdasarkan aksi
  async createLikeNotification(postId: string, likerId: string) {
    try {
      // Dapatkan informasi post dan author
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Dapatkan informasi liker
      const liker = await prisma.user.findUnique({
        where: { id: likerId },
        select: {
          id: true,
          username: true,
          name: true,
        },
      });

      if (!liker) {
        throw new Error('User not found');
      }

      // Jangan buat notifikasi jika user like post sendiri
      if (post.authorId === likerId) {
        return null;
      }

      const message = `${liker.name} (@${liker.username}) menyukai postingan Anda`;

      return await this.createNotification({
        type: 'LIKE',
        message,
        receiverId: post.authorId,
        senderId: likerId,
        postId: postId,
      });
    } catch (error) {
      console.error('Error creating like notification:', error);
      throw error;
    }
  }

  async createCommentNotification(commentId: string, commenterId: string) {
    try {
      // Dapatkan informasi comment, post, dan author
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
          author: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      });

      if (!comment) {
        throw new Error('Comment not found');
      }

      // Jangan buat notifikasi jika user comment di post sendiri
      if (comment.post.authorId === commenterId) {
        return null;
      }

      const message = `${comment.author.name} (@${comment.author.username}) berkomentar di postingan Anda`;

      return await this.createNotification({
        type: 'COMMENT',
        message,
        receiverId: comment.post.authorId,
        senderId: commenterId,
        postId: comment.postId,
        commentId: commentId,
      });
    } catch (error) {
      console.error('Error creating comment notification:', error);
      throw error;
    }
  }

  async createFollowNotification(followerId: string, followingId: string) {
    try {
      // Dapatkan informasi follower
      const follower = await prisma.user.findUnique({
        where: { id: followerId },
        select: {
          id: true,
          username: true,
          name: true,
        },
      });

      if (!follower) {
        throw new Error('Follower not found');
      }

      const message = `${follower.name} (@${follower.username}) mulai mengikuti Anda`;

      return await this.createNotification({
        type: 'FOLLOW',
        message,
        receiverId: followingId,
        senderId: followerId,
      });
    } catch (error) {
      console.error('Error creating follow notification:', error);
      throw error;
    }
  }
}

export default new NotificationService();
