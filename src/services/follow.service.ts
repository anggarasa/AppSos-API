import prisma from "../config/db";
import notificationService from "./notification.service";
import { PaginationParams, PaginationResult, createPaginationResult } from "../utils/pagination";

export const followUser = async (followerId: string, followingId: string) => {
    try {
        // Check if both users exist
        const follower = await prisma.user.findUnique({ where: { id: followerId } });
        const following = await prisma.user.findUnique({ where: { id: followingId } });

        if (!follower) {
            throw new Error('Follower user not found');
        }

        if (!following) {
            throw new Error('Following user not found');
        }

        // Check if user is trying to follow themselves
        if (followerId === followingId) {
            throw new Error('Cannot follow yourself');
        }

        // Check if already following
        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: followerId,
                followingId: followingId
            }
        });

        if (existingFollow) {
            throw new Error('Already following this user');
        }

        // Create follow relationship
        const follow = await prisma.follow.create({
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

        // Create notification for the user being followed
        try {
            await notificationService.createFollowNotification(followerId, followingId);
        } catch (notificationError) {
            console.error('Error creating follow notification:', notificationError);
            // Don't throw error here, just log it
        }

        return follow;
    } catch (error) {
        throw error;
    }
};

export const unfollowUser = async (followerId: string, followingId: string) => {
    try {
        // Check if follow relationship exists
        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: followerId,
                followingId: followingId
            }
        });

        if (!existingFollow) {
            throw new Error('Follow relationship not found');
        }

        // Delete follow relationship
        await prisma.follow.delete({
            where: { id: existingFollow.id }
        });

        return {
            status: 200,
            message: "Successfully unfollowed user"
        };
    } catch (error) {
        throw error;
    }
};

export const getFollowers = async (userId: string, pagination: PaginationParams): Promise<PaginationResult<any>> => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
            throw new Error('User not found');
        }

        const [followers, total] = await Promise.all([
            prisma.follow.findMany({
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
                skip: pagination.offset,
                take: pagination.limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.follow.count({ where: { followingId: userId } })
        ]);

        const followersData = followers.map(follow => follow.follower);
        return createPaginationResult(followersData, total, pagination.page, pagination.limit);
    } catch (error) {
        throw error;
    }
};

export const getFollowing = async (userId: string, pagination: PaginationParams): Promise<PaginationResult<any>> => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
            throw new Error('User not found');
        }

        const [following, total] = await Promise.all([
            prisma.follow.findMany({
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
                skip: pagination.offset,
                take: pagination.limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.follow.count({ where: { followerId: userId } })
        ]);

        const followingData = following.map(follow => follow.following);
        return createPaginationResult(followingData, total, pagination.page, pagination.limit);
    } catch (error) {
        throw error;
    }
};

export const getFollowStats = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
            throw new Error('User not found');
        }

        const [followersCount, followingCount] = await Promise.all([
            prisma.follow.count({ where: { followingId: userId } }),
            prisma.follow.count({ where: { followerId: userId } })
        ]);

        return {
            followersCount,
            followingCount
        };
    } catch (error) {
        throw error;
    }
};

// check if user is following another user
export const isUserFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
    try {
        const follow = await prisma.follow.findFirst({
            where: {
                followerId: followerId,
                followingId: followingId
            }
        });
        return !!follow;
    } catch (error) {
        throw error;
    }
};

// get mutual follows between two users with pagination
export const getMutualFollows = async (userId1: string, userId2: string, pagination: PaginationParams): Promise<PaginationResult<any>> => {
    try {
        // Get users that both userId1 and userId2 are following
        const user1Following = await prisma.follow.findMany({
            where: { followerId: userId1 },
            select: { followingId: true }
        });

        const user2Following = await prisma.follow.findMany({
            where: { followerId: userId2 },
            select: { followingId: true }
        });

        const user1FollowingIds = user1Following.map(f => f.followingId);
        const user2FollowingIds = user2Following.map(f => f.followingId);

        const mutualIds = user1FollowingIds.filter(id => user2FollowingIds.includes(id));

        if (mutualIds.length === 0) {
            return createPaginationResult([], 0, pagination.page, pagination.limit);
        }

        const [mutualUsers, total] = await Promise.all([
            prisma.user.findMany({
                where: { id: { in: mutualIds } },
                select: {
                    id: true,
                    username: true,
                    name: true,
                    avatarUrl: true,
                    bio: true
                },
                skip: pagination.offset,
                take: pagination.limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where: { id: { in: mutualIds } } })
        ]);

        return createPaginationResult(mutualUsers, total, pagination.page, pagination.limit);
    } catch (error) {
        throw error;
    }
};

// get follow by id
export const findFollowById = (id: string) =>
  prisma.follow.findUnique({
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

// get follow suggestions (users not followed by the user) with pagination
export const getFollowSuggestions = async (userId: string, pagination: PaginationParams): Promise<PaginationResult<any>> => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
            throw new Error('User not found');
        }

        // Get users that the current user is already following
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });

        const followingIds = following.map(f => f.followingId);
        followingIds.push(userId); // Exclude self

        const [suggestions, total] = await Promise.all([
            prisma.user.findMany({
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
                skip: pagination.offset,
                take: pagination.limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.user.count({
                where: {
                    id: { notIn: followingIds }
                }
            })
        ]);

        return createPaginationResult(suggestions, total, pagination.page, pagination.limit);
    } catch (error) {
        throw error;
    }
};