"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLikeById = exports.findLikesByUserId = exports.findLikedPostsByUserId = exports.hasUserLikedPost = exports.getLikeCount = exports.deleteLikeByUserAndPost = exports.deleteLikeById = exports.insertLike = void 0;
const db_1 = __importDefault(require("../config/db"));
const notification_service_1 = __importDefault(require("./notification.service"));
const insertLike = async (userId, postId) => {
    try {
        const existingUser = await db_1.default.user.findUnique({
            where: { id: userId }
        });
        const existingPost = await db_1.default.post.findUnique({
            where: { id: postId }
        });
        if (!existingUser) {
            throw new Error('User not found');
        }
        if (!existingPost) {
            throw new Error('Post not found');
        }
        const existingLike = await db_1.default.like.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        });
        if (existingLike) {
            throw new Error('User already liked this post');
        }
        const createLike = await db_1.default.like.create({
            data: {
                postId: postId,
                userId: userId
            }
        });
        try {
            await notification_service_1.default.createLikeNotification(postId, userId);
        }
        catch (notificationError) {
            console.error('Error creating like notification:', notificationError);
        }
        return createLike;
    }
    catch (error) {
        throw error;
    }
};
exports.insertLike = insertLike;
const deleteLikeById = async (id) => {
    try {
        const existingLike = await db_1.default.like.findUnique({
            where: { id: id }
        });
        if (!existingLike) {
            throw new Error('Like not found');
        }
        await db_1.default.like.delete({
            where: { id }
        });
        return {
            status: 200,
            message: "Like deleted successfully",
            data: {}
        };
    }
    catch (error) {
        throw error;
    }
};
exports.deleteLikeById = deleteLikeById;
const deleteLikeByUserAndPost = async (userId, postId) => {
    try {
        const existingLike = await db_1.default.like.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        });
        if (!existingLike) {
            throw new Error('Like not found');
        }
        await db_1.default.like.delete({
            where: { id: existingLike.id }
        });
        return {
            status: 200,
            message: "Like deleted successfully",
            data: {}
        };
    }
    catch (error) {
        throw error;
    }
};
exports.deleteLikeByUserAndPost = deleteLikeByUserAndPost;
const getLikeCount = async (postId) => {
    try {
        const count = await db_1.default.like.count({
            where: { postId: postId }
        });
        return count;
    }
    catch (error) {
        throw error;
    }
};
exports.getLikeCount = getLikeCount;
const hasUserLikedPost = async (userId, postId) => {
    try {
        const like = await db_1.default.like.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        });
        return !!like;
    }
    catch (error) {
        throw error;
    }
};
exports.hasUserLikedPost = hasUserLikedPost;
const findLikedPostsByUserId = (userId) => db_1.default.like.findMany({
    where: { userId },
    select: {
        id: true,
        createdAt: true,
        post: {
            select: {
                id: true,
                authorId: true,
                content: true,
                imageUrl: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                        saves: true,
                    },
                },
            },
        },
    },
    orderBy: { createdAt: 'desc' },
});
exports.findLikedPostsByUserId = findLikedPostsByUserId;
const findLikesByUserId = (userId) => db_1.default.like.findMany({
    where: { userId },
    select: {
        id: true,
        postId: true,
        createdAt: true,
        post: {
            select: {
                id: true,
                content: true,
                imageUrl: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
        },
    },
    orderBy: { createdAt: 'desc' },
});
exports.findLikesByUserId = findLikesByUserId;
const findLikeById = (id) => db_1.default.like.findUnique({
    where: { id },
    select: {
        id: true,
        userId: true,
        postId: true,
        createdAt: true,
        user: {
            select: {
                id: true,
                username: true,
                avatarUrl: true,
            },
        },
        post: {
            select: {
                id: true,
                content: true,
                imageUrl: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
        },
    },
});
exports.findLikeById = findLikeById;
//# sourceMappingURL=like.service.js.map