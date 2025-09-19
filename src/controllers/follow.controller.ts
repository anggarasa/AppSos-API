import { Request, Response } from "express";
import { 
    followUser, 
    unfollowUser, 
    getFollowers, 
    getFollowing, 
    getFollowStats,
    isUserFollowing,
    getMutualFollows,
    findFollowById,
    getFollowSuggestions
} from "../services/follow.service";
import { parsePaginationParams } from "../utils/pagination";

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
        const pagination = parsePaginationParams(req.query);
        const result = await getFollowers(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "Followers retrieved successfully",
            data: result.data,
            pagination: result.pagination
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
        const pagination = parsePaginationParams(req.query);
        const result = await getFollowing(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "Following list retrieved successfully",
            data: result.data,
            pagination: result.pagination
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

// check if user is following another user
export const checkFollowStatus = async (req: Request, res: Response) => {
    const { followerId, followingId } = req.params;

    try {
        const isFollowing = await isUserFollowing(followerId, followingId);
        return res.status(200).json({
            status: 200,
            message: "Follow status retrieved successfully",
            data: { isFollowing }
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
};

// get mutual follows between two users with pagination
export const getMutualFollowsList = async (req: Request, res: Response) => {
    const { userId1, userId2 } = req.params;

    try {
        const pagination = parsePaginationParams(req.query);
        const result = await getMutualFollows(userId1, userId2, pagination);
        return res.status(200).json({
            status: 200,
            message: "Mutual follows retrieved successfully",
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: []
        });
    }
};

// get follow by id
export const getFollow = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const follow = await findFollowById(id);
        if (!follow) {
            return res.status(404).json({
                status: 404,
                message: "Follow relationship not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Follow relationship retrieved successfully",
            data: follow
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
};

// get follow suggestions with pagination
export const getFollowSuggestionsList = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    try {
        const pagination = parsePaginationParams(req.query);
        const result = await getFollowSuggestions(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "Follow suggestions retrieved successfully",
            data: result.data,
            pagination: result.pagination
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
                data: []
            });
        }
    }
};
