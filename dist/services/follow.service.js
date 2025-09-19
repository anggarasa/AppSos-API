"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowSuggestions = exports.findFollowById = exports.getMutualFollows = exports.isUserFollowing = exports.getFollowStats = exports.getFollowing = exports.getFollowers = exports.unfollowUser = exports.followUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const notification_service_1 = __importDefault(require("./notification.service"));
const followUser = async (followerId, followingId) => {
    try {
        const follower = await db_1.default.user.findUnique({ where: { id: followerId } });
        const following = await db_1.default.user.findUnique({ where: { id: followingId } });
        if (!follower) {
            throw new Error('Follower user not found');
        }
        if (!following) {
            throw new Error('Following user not found');
        }
        if (followerId === followingId) {
            throw new Error('Cannot follow yourself');
        }
        const existingFollow = await db_1.default.follow.findFirst({
            where: {
                followerId: followerId,
                followingId: followingId
            }
        });
        if (existingFollow) {
            throw new Error('Already following this user');
        }
        const follow = await db_1.default.follow.create({
            data: {
                followerId: followerId,
                followingId: followingId
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatarUrl: true
                    }
                },
                following: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            }
        });
        try {
            await notification_service_1.default.createFollowNotification(followerId, followingId);
        }
        catch (notificationError) {
            console.error('Error creating follow notification:', notificationError);
        }
        return follow;
    }
    catch (error) {
        throw error;
    }
};
exports.followUser = followUser;
const unfollowUser = async (followerId, followingId) => {
    try {
        const existingFollow = await db_1.default.follow.findFirst({
            where: {
                followerId: followerId,
                followingId: followingId
            }
        });
        if (!existingFollow) {
            throw new Error('Follow relationship not found');
        }
        await db_1.default.follow.delete({
            where: { id: existingFollow.id }
        });
        return {
            status: 200,
            message: "Successfully unfollowed user"
        };
    }
    catch (error) {
        throw error;
    }
};
exports.unfollowUser = unfollowUser;
const getFollowers = async (userId) => {
    try {
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const followers = await db_1.default.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatarUrl: true,
                        bio: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return followers.map(follow => follow.follower);
    }
    catch (error) {
        throw error;
    }
};
exports.getFollowers = getFollowers;
const getFollowing = async (userId) => {
    try {
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const following = await db_1.default.follow.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatarUrl: true,
                        bio: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return following.map(follow => follow.following);
    }
    catch (error) {
        throw error;
    }
};
exports.getFollowing = getFollowing;
const getFollowStats = async (userId) => {
    try {
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const [followersCount, followingCount] = await Promise.all([
            db_1.default.follow.count({ where: { followingId: userId } }),
            db_1.default.follow.count({ where: { followerId: userId } })
        ]);
        return {
            followersCount,
            followingCount
        };
    }
    catch (error) {
        throw error;
    }
};
exports.getFollowStats = getFollowStats;
const isUserFollowing = async (followerId, followingId) => {
    try {
        const follow = await db_1.default.follow.findFirst({
            where: {
                followerId: followerId,
                followingId: followingId
            }
        });
        return !!follow;
    }
    catch (error) {
        throw error;
    }
};
exports.isUserFollowing = isUserFollowing;
const getMutualFollows = async (userId1, userId2) => {
    try {
        const user1Following = await db_1.default.follow.findMany({
            where: { followerId: userId1 },
            select: { followingId: true }
        });
        const user2Following = await db_1.default.follow.findMany({
            where: { followerId: userId2 },
            select: { followingId: true }
        });
        const user1FollowingIds = user1Following.map(f => f.followingId);
        const user2FollowingIds = user2Following.map(f => f.followingId);
        const mutualIds = user1FollowingIds.filter(id => user2FollowingIds.includes(id));
        if (mutualIds.length === 0) {
            return [];
        }
        const mutualUsers = await db_1.default.user.findMany({
            where: { id: { in: mutualIds } },
            select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
                bio: true
            }
        });
        return mutualUsers;
    }
    catch (error) {
        throw error;
    }
};
exports.getMutualFollows = getMutualFollows;
const findFollowById = (id) => db_1.default.follow.findUnique({
    where: { id },
    select: {
        id: true,
        followerId: true,
        followingId: true,
        createdAt: true,
        follower: {
            select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
            },
        },
        following: {
            select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
            },
        },
    },
});
exports.findFollowById = findFollowById;
const getFollowSuggestions = async (userId, limit = 10) => {
    try {
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const following = await db_1.default.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });
        const followingIds = following.map(f => f.followingId);
        followingIds.push(userId);
        const suggestions = await db_1.default.user.findMany({
            where: {
                id: { notIn: followingIds }
            },
            select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true,
                bio: true,
                _count: {
                    select: {
                        followers: true,
                        following: true
                    }
                }
            },
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });
        return suggestions;
    }
    catch (error) {
        throw error;
    }
};
exports.getFollowSuggestions = getFollowSuggestions;
//# sourceMappingURL=follow.service.js.map