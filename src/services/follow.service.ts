import prisma from "../config/db";

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

export const getFollowers = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
            throw new Error('User not found');
        }

        const followers = await prisma.follow.findMany({
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
    } catch (error) {
        throw error;
    }
};

export const getFollowing = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
            throw new Error('User not found');
        }

        const following = await prisma.follow.findMany({
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
