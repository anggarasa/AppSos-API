import { Request, Response } from "express";
import { 
    followUser, 
    unfollowUser, 
    getFollowers, 
    getFollowing, 
    getFollowStats 
} from "../services/follow.service";

export const follow = async (req: Request, res: Response) => {
    const { followerId, followingId } = req.body;

    try {
        const result = await followUser(followerId, followingId);
        return res.status(201).json({
            status: 201,
            message: "Successfully followed user",
            data: result
        });
    } catch (error: any) {
        if (error.message === 'Follower user not found' || error.message === 'Following user not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else if (error.message === 'Cannot follow yourself') {
            return res.status(400).json({
                status: 400,
                message: error.message,
                data: {}
            });
        } else if (error.message === 'Already following this user') {
            return res.status(409).json({
                status: 409,
                message: error.message,
                data: {}
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};

export const unfollow = async (req: Request, res: Response) => {
    const { followerId, followingId } = req.body;

    try {
        const result = await unfollowUser(followerId, followingId);
        return res.status(200).json({
            status: 200,
            message: result.message,
            data: {}
        });
    } catch (error: any) {
        if (error.message === 'Follow relationship not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};

export const getFollowersList = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const followers = await getFollowers(userId);
        return res.status(200).json({
            status: 200,
            message: "Followers retrieved successfully",
            data: followers
        });
    } catch (error: any) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};

export const getFollowingList = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const following = await getFollowing(userId);
        return res.status(200).json({
            status: 200,
            message: "Following list retrieved successfully",
            data: following
        });
    } catch (error: any) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};

export const getFollowStatistics = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const stats = await getFollowStats(userId);
        return res.status(200).json({
            status: 200,
            message: "Follow statistics retrieved successfully",
            data: stats
        });
    } catch (error: any) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
