"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSaveByUserIdAndPostId = exports.findSaveById = exports.getSaveCount = exports.hasUserSavedPost = exports.findSavedPostsByUserId = exports.insertSave = void 0;
const db_1 = __importDefault(require("../config/db"));
const insertSave = async (userId, postId) => {
    try {
        const existingUser = await db_1.default.user.findUnique({ where: { id: userId } });
        const existingPost = await db_1.default.post.findUnique({ where: { id: postId } });
        if (!existingPost) {
            throw new Error('Post not found');
        }
        if (!existingUser) {
            throw new Error('User not found');
        }
        const createSave = await db_1.default.save.create({
            data: {
                userId: userId,
                postId: postId
            }
        });
        return createSave;
    }
    catch (error) {
        throw error;
    }
};
exports.insertSave = insertSave;
const findSavedPostsByUserId = (userId) => db_1.default.save.findMany({
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
exports.findSavedPostsByUserId = findSavedPostsByUserId;
const hasUserSavedPost = async (userId, postId) => {
    try {
        const save = await db_1.default.save.findFirst({
            where: {
                userId,
                postId,
            },
        });
        return !!save;
    }
    catch (error) {
        throw error;
    }
};
exports.hasUserSavedPost = hasUserSavedPost;
const getSaveCount = async (postId) => {
    try {
        const count = await db_1.default.save.count({
            where: { postId },
        });
        return count;
    }
    catch (error) {
        throw error;
    }
};
exports.getSaveCount = getSaveCount;
const findSaveById = (id) => db_1.default.save.findUnique({
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
exports.findSaveById = findSaveById;
const deleteSaveByUserIdAndPostId = async (userId, postId) => {
    try {
        const existingSave = await db_1.default.save.findFirst({
            where: {
                userId: userId,
                postId: postId
            }
        });
        if (!existingSave) {
            throw new Error('Save not found');
        }
        await db_1.default.save.delete({
            where: { id: existingSave.id }
        });
        return {
            status: 200,
            message: "Save deleted successfully"
        };
    }
    catch (error) {
        throw error;
    }
};
exports.deleteSaveByUserIdAndPostId = deleteSaveByUserIdAndPostId;
//# sourceMappingURL=save.service.js.map