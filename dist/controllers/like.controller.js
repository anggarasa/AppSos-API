"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserLike = exports.getPostLikeCount = exports.unlikePost = exports.deleteLike = exports.createLike = void 0;
const like_service_1 = require("../services/like.service");
const createLike = async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const result = await (0, like_service_1.insertLike)(userId, postId);
        return res.status(201).json({
            status: 201,
            message: "Like created successfully",
            data: result
        });
    }
    catch (error) {
        if (error.message === 'User not found' || error.message === 'Post not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else if (error.message === 'User already liked this post') {
            return res.status(409).json({
                status: 409,
                message: error.message,
                data: {}
            });
        }
        else {
            console.error('Error creating like:', error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.createLike = createLike;
const deleteLike = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await (0, like_service_1.deleteLikeById)(id);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Like not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else {
            console.error('Error deleting like:', error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.deleteLike = deleteLike;
const unlikePost = async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const result = await (0, like_service_1.deleteLikeByUserAndPost)(userId, postId);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Like not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else {
            console.error('Error unliking post:', error);
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.unlikePost = unlikePost;
const getPostLikeCount = async (req, res) => {
    const postId = req.params.postId;
    try {
        const count = await (0, like_service_1.getLikeCount)(postId);
        return res.status(200).json({
            status: 200,
            message: "Like count retrieved successfully",
            data: { likeCount: count }
        });
    }
    catch (error) {
        console.error('Error getting like count:', error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
};
exports.getPostLikeCount = getPostLikeCount;
const checkUserLike = async (req, res) => {
    const { userId, postId } = req.params;
    try {
        const hasLiked = await (0, like_service_1.hasUserLikedPost)(userId, postId);
        return res.status(200).json({
            status: 200,
            message: "User like status retrieved successfully",
            data: { hasLiked }
        });
    }
    catch (error) {
        console.error('Error checking user like:', error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
};
exports.checkUserLike = checkUserLike;
//# sourceMappingURL=like.controller.js.map