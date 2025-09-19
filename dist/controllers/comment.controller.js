"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getComment = exports.getCommentsByUser = exports.getCommentsByPost = exports.createComment = void 0;
const comment_service_1 = require("../services/comment.service");
const pagination_1 = require("../utils/pagination");
const createComment = async (req, res) => {
    const { userId, postId, content } = req.body;
    try {
        const result = await (0, comment_service_1.insertComment)(userId, postId, content);
        return res.status(201).json({
            status: 201,
            message: "Comment created successfully",
            data: result
        });
    }
    catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else if (error.message === 'Post not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.createComment = createComment;
const getCommentsByPost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const pagination = (0, pagination_1.parsePaginationParams)(req.query);
        const result = await (0, comment_service_1.findCommentsByPostId)(postId, pagination);
        return res.status(200).json({
            status: 200,
            message: "Comments retrieved successfully",
            data: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: []
        });
    }
};
exports.getCommentsByPost = getCommentsByPost;
const getCommentsByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const pagination = (0, pagination_1.parsePaginationParams)(req.query);
        const result = await (0, comment_service_1.findCommentsByUserId)(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "User comments retrieved successfully",
            data: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: []
        });
    }
};
exports.getCommentsByUser = getCommentsByUser;
const getComment = async (req, res) => {
    const id = req.params.id;
    try {
        const comment = await (0, comment_service_1.findCommentById)(id);
        if (!comment) {
            return res.status(404).json({
                status: 404,
                message: "Comment not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Comment retrieved successfully",
            data: comment
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
};
exports.getComment = getComment;
const updateComment = async (req, res) => {
    const id = req.params.id;
    const { userId, content } = req.body;
    try {
        const result = await (0, comment_service_1.updateCommentById)(id, userId, content);
        return res.status(200).json({
            status: 200,
            message: "Comment updated successfully",
            data: result
        });
    }
    catch (error) {
        if (error.message === 'Comment not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else if (error.message === 'Unauthorized to update this comment') {
            return res.status(403).json({
                status: 403,
                message: error.message,
                data: {}
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                data: {}
            });
        }
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await (0, comment_service_1.deleteCommentById)(id);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Comment not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error"
            });
        }
    }
};
exports.deleteComment = deleteComment;
//# sourceMappingURL=comment.controller.js.map