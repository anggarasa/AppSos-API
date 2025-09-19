"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.getUserActivity = exports.getUserFollowingCount = exports.getUserFollowersCount = exports.getUserPostsCount = exports.searchUsers = exports.findUserByUsername = exports.findUserProfileWithStats = exports.updateUserById = exports.findUserById = exports.findAllUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const supabase_1 = require("../config/supabase");
const crypto_1 = require("crypto");
const pagination_1 = require("../utils/pagination");
const findAllUsers = async (pagination) => {
    const [users, total] = await Promise.all([
        db_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bio: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true
            },
            skip: pagination.offset,
            take: pagination.limit,
            orderBy: { createdAt: 'desc' },
        }),
        db_1.default.user.count(),
    ]);
    return (0, pagination_1.createPaginationResult)(users, total, pagination.page, pagination.limit);
};
exports.findAllUsers = findAllUsers;
const findUserById = (id) => db_1.default.user.findUnique({
    where: { id },
    select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
    }
});
exports.findUserById = findUserById;
const updateUserById = async (id, data) => {
    try {
        const existingUser = await db_1.default.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new Error('User not found');
        }
        if (data.username && data.username !== existingUser.username) {
            const existingUsername = await db_1.default.user.findUnique({
                where: { username: data.username }
            });
            if (existingUsername) {
                throw new Error('Username already exists');
            }
        }
        if (data.email && data.email !== existingUser.email) {
            const existingEmail = await db_1.default.user.findUnique({
                where: { email: data.email }
            });
            if (existingEmail) {
                throw new Error('Email already exists');
            }
        }
        const updatePayload = {};
        if (data.name !== undefined)
            updatePayload.name = data.name;
        if (data.email !== undefined)
            updatePayload.email = data.email;
        if (data.username !== undefined)
            updatePayload.username = data.username;
        if (data.bio !== undefined)
            updatePayload.bio = data.bio;
        if (data.avatar) {
            const bucket = 'avatars';
            const fileExt = (data.avatar.originalname.split('.').pop() || 'jpg').toLowerCase();
            const fileName = `${(0, crypto_1.randomUUID)()}.${fileExt}`;
            const filePath = `${id}/${fileName}`;
            const { data: uploadData, error: uploadError } = await supabase_1.supabase
                .storage
                .from(bucket)
                .upload(filePath, data.avatar.buffer, {
                contentType: data.avatar.mimetype,
                upsert: true,
            });
            if (uploadError) {
                throw new Error(`Failed to upload avatar: ${uploadError.message}`);
            }
            const { data: publicUrlData } = supabase_1.supabase
                .storage
                .from(bucket)
                .getPublicUrl(filePath);
            if (existingUser.avatarUrl) {
                try {
                    const publicUrlPrefix = `/storage/v1/object/public/${bucket}/`;
                    const idx = existingUser.avatarUrl.indexOf(publicUrlPrefix);
                    if (idx !== -1) {
                        const previousPath = existingUser.avatarUrl.substring(idx + publicUrlPrefix.length);
                        await supabase_1.supabase.storage.from(bucket).remove([previousPath]);
                    }
                }
                catch (_) {
                }
            }
            updatePayload.avatarUrl = publicUrlData.publicUrl;
        }
        const updatedUser = await db_1.default.user.update({
            where: { id },
            data: updatePayload,
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bio: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return updatedUser;
    }
    catch (error) {
        throw error;
    }
};
exports.updateUserById = updateUserById;
const findUserProfileWithStats = (id) => db_1.default.user.findUnique({
    where: { id },
    select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
            select: {
                posts: true,
                followers: true,
                following: true,
                comments: true,
                likes: true,
                saves: true,
            },
        },
    },
});
exports.findUserProfileWithStats = findUserProfileWithStats;
const findUserByUsername = (username) => db_1.default.user.findUnique({
    where: { username },
    select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
            select: {
                posts: true,
                followers: true,
                following: true,
            },
        },
    },
});
exports.findUserByUsername = findUserByUsername;
const searchUsers = async (query, pagination) => {
    const [users, total] = await Promise.all([
        db_1.default.user.findMany({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                bio: true,
                _count: {
                    select: {
                        posts: true,
                        followers: true,
                        following: true,
                    },
                },
            },
            skip: pagination.offset,
            take: pagination.limit,
            orderBy: { createdAt: 'desc' },
        }),
        db_1.default.user.count({
            where: {
                OR: [
                    { username: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } },
                ],
            },
        }),
    ]);
    return (0, pagination_1.createPaginationResult)(users, total, pagination.page, pagination.limit);
};
exports.searchUsers = searchUsers;
const getUserPostsCount = async (userId) => {
    try {
        const count = await db_1.default.post.count({
            where: { authorId: userId },
        });
        return count;
    }
    catch (error) {
        throw error;
    }
};
exports.getUserPostsCount = getUserPostsCount;
const getUserFollowersCount = async (userId) => {
    try {
        const count = await db_1.default.follow.count({
            where: { followingId: userId },
        });
        return count;
    }
    catch (error) {
        throw error;
    }
};
exports.getUserFollowersCount = getUserFollowersCount;
const getUserFollowingCount = async (userId) => {
    try {
        const count = await db_1.default.follow.count({
            where: { followerId: userId },
        });
        return count;
    }
    catch (error) {
        throw error;
    }
};
exports.getUserFollowingCount = getUserFollowingCount;
const getUserActivity = async (userId, pagination) => {
    try {
        const limitPerType = Math.ceil(pagination.limit / 3);
        const [recentPosts, recentComments, recentLikes] = await Promise.all([
            db_1.default.post.findMany({
                where: { authorId: userId },
                select: {
                    id: true,
                    content: true,
                    imageUrl: true,
                    createdAt: true,
                    _count: {
                        select: {
                            comments: true,
                            likes: true,
                            saves: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: limitPerType,
            }),
            db_1.default.comment.findMany({
                where: { authorId: userId },
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    post: {
                        select: {
                            id: true,
                            content: true,
                            imageUrl: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: limitPerType,
            }),
            db_1.default.like.findMany({
                where: { userId: userId },
                select: {
                    id: true,
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
                take: limitPerType,
            }),
        ]);
        const allActivities = [
            ...recentPosts.map(post => ({ ...post, type: 'post' })),
            ...recentComments.map(comment => ({ ...comment, type: 'comment' })),
            ...recentLikes.map(like => ({ ...like, type: 'like' })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const [postsCount, commentsCount, likesCount] = await Promise.all([
            db_1.default.post.count({ where: { authorId: userId } }),
            db_1.default.comment.count({ where: { authorId: userId } }),
            db_1.default.like.count({ where: { userId } }),
        ]);
        const totalActivities = postsCount + commentsCount + likesCount;
        return (0, pagination_1.createPaginationResult)(allActivities, totalActivities, pagination.page, pagination.limit);
    }
    catch (error) {
        throw error;
    }
};
exports.getUserActivity = getUserActivity;
const deleteUserById = async (id) => {
    try {
        const existingUser = await db_1.default.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new Error('User not found');
        }
        await db_1.default.user.delete({ where: { id } });
        return {
            status: 200,
            message: 'User deleted successfully'
        };
    }
    catch (error) {
        throw error;
    }
};
exports.deleteUserById = deleteUserById;
//# sourceMappingURL=user.service.js.map