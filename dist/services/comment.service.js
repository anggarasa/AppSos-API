"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentById = exports.findCommentById = exports.updateCommentById = exports.findCommentsByUserId = exports.findCommentsByPostId = exports.insertComment = void 0;
const db_1 = __importDefault(require("../config/db"));
const notification_service_1 = __importDefault(require("./notification.service"));
const pagination_1 = require("../utils/pagination");
const insertComment = async (userId, postId, content) => {
    try {
        const existingPost = await db_1.default.post.findUnique({ where: { id: postId } });
        const existingUser = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!existingPost) {
            throw new Error('Post not found');
        }
        if (!existingUser) {
            throw new Error('User not found');
        }
        const createComment = await db_1.default.comment.create({
            data: {
                authorId: userId,
                postId: postId,
                content: content,
            },
            select: {
                id: true,
                authorId: true,
                postId: true,
                content: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                    }
                },
            }
        });
        try {
            await notification_service_1.default.createCommentNotification(createComment.id, userId);
        }
        catch (notificationError) {
            console.error('Error creating comment notification:', notificationError);
        }
        return createComment;
    }
    catch (error) {
        throw error;
    }
};
exports.insertComment = insertComment;
const findCommentsByPostId = async (postId, pagination) => {
    const [comments, total] = await Promise.all([
        db_1.default.comment.findMany({
            where: { postId },
            select: {
                id: true,
                authorId: true,
                postId: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
            skip: pagination.offset,
            take: pagination.limit,
            orderBy: { createdAt: 'asc' },
        }),
        db_1.default.comment.count({ where: { postId } }),
    ]);
    return (0, pagination_1.createPaginationResult)(comments, total, pagination.page, pagination.limit);
};
exports.findCommentsByPostId = findCommentsByPostId;
const findCommentsByUserId = async (userId, pagination) => {
    const [comments, total] = await Promise.all([
        db_1.default.comment.findMany({
            where: { authorId: userId },
            select: {
                id: true,
                authorId: true,
                postId: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                author: {
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
            skip: pagination.offset,
            take: pagination.limit,
            orderBy: { createdAt: 'desc' },
        }),
        db_1.default.comment.count({ where: { authorId: userId } }),
    ]);
    return (0, pagination_1.createPaginationResult)(comments, total, pagination.page, pagination.limit);
};
exports.findCommentsByUserId = findCommentsByUserId;
const updateCommentById = async (id, userId, content) => {
    try {
        const existingComment = await db_1.default.comment.findUnique({
            where: { id },
            select: { authorId: true }
        });
        if (!existingComment) {
            throw new Error('Comment not found');
        }
        if (existingComment.authorId !== userId) {
            throw new Error('Unauthorized to update this comment');
        }
        const updatedComment = await db_1.default.comment.update({
            where: { id },
            data: { content },
            select: {
                id: true,
                authorId: true,
                postId: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        return updatedComment;
    }
    catch (error) {
        throw error;
    }
};
exports.updateCommentById = updateCommentById;
const findCommentById = (id) => db_1.default.comment.findUnique({
    where: { id },
    select: {
        id: true,
        authorId: true,
        postId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
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
exports.findCommentById = findCommentById;
const deleteCommentById = async (id) => {
    try {
        const existingComment = await db_1.default.comment.findUnique({
            where: { id }
        });
        if (!existingComment) {
            throw new Error('Comment not found');
        }
        await db_1.default.comment.delete({ where: { id } });
        return {
            status: 200,
            message: 'Comment deleted successfully'
        };
    }
    catch (error) {
        throw error;
    }
};
exports.deleteCommentById = deleteCommentById;
//# sourceMappingURL=comment.service.js.map