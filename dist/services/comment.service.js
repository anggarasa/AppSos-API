"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentById = exports.insertComment = void 0;
const db_1 = __importDefault(require("../config/db"));
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
        return createComment;
    }
    catch (error) {
        throw error;
    }
};
exports.insertComment = insertComment;
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