"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowStats = exports.getFollowing = exports.getFollowers = exports.unfollowUser = exports.followUser = void 0;
const db_1 = __importDefault(require("../config/db"));
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
//# sourceMappingURL=follow.service.js.map