// controller file - FIXED VERSION
import { Request, Response } from "express";
import { 
    deleteLikeById, 
    insertLike,
    deleteLikeByUserAndPost,
    getLikeCount,
    hasUserLikedPost,
    findLikedPostsByUserId,
    findLikesByUserId,
    findLikeById
} from "../services/like.service";

export const createLike = async (req: Request, res: Response) => {
    const { userId, postId } = req.body;

    try {
        const result = await insertLike(userId, postId);
        return res.status(201).json({
            status: 201,
            message: "Like created successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message === 'User not found' || error.message === 'Post not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else if (error.message === 'User already liked this post') {
            return res.status(409).json({
                status: 409,
                message: error.message,
                data: {}
            });
        } else {
            console.error('Error creating like:', error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
}

export const deleteLike = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const result = await deleteLikeById(id);
        return res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Like not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else {
            console.error('Error deleting like:', error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
}

// New controller for unlike by user and post
export const unlikePost = async (req: Request, res: Response) => {
    const { userId, postId } = req.body;

    try {
        const result = await deleteLikeByUserAndPost(userId, postId);
        return res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Like not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        } else {
            console.error('Error unliking post:', error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
}

// Get like count for a post
export const getPostLikeCount = async (req: Request, res: Response) => {
    const postId: string = req.params.postId;

    try {
        const count = await getLikeCount(postId);
        return res.status(200).json({
            status: 200,
            message: "Like count retrieved successfully",
            data: { likeCount: count }
        });
    } catch (error: any) {
        console.error('Error getting like count:', error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
}

// Check if user has liked a post
export const checkUserLike = async (req: Request, res: Response) => {
    const { userId, postId } = req.params;

    try {
        const hasLiked = await hasUserLikedPost(userId, postId);
        return res.status(200).json({
            status: 200,
            message: "User like status retrieved successfully",
            data: { hasLiked }
        });
    } catch (error: any) {
        console.error('Error checking user like:', error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
}

// get liked posts by user
export const getLikedPostsByUser = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    try {
        const likedPosts = await findLikedPostsByUserId(userId);
        return res.status(200).json({
            status: 200,
            message: "Liked posts retrieved successfully",
            data: likedPosts
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: []
        });
    }
}

// get likes by user
export const getLikesByUser = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;

    try {
        const likes = await findLikesByUserId(userId);
        return res.status(200).json({
            status: 200,
            message: "User likes retrieved successfully",
            data: likes
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: []
        });
    }
}

// get like by id
export const getLike = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const like = await findLikeById(id);
        if (!like) {
            return res.status(404).json({
                status: 404,
                message: "Like not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Like retrieved successfully",
            data: like
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
}