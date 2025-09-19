"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.getSavedPostsByUser = exports.getPostsByUser = exports.updatePost = exports.createPost = exports.getPost = exports.getPosts = void 0;
const post_service_1 = require("../services/post.service");
const pagination_1 = require("../utils/pagination");
const getPosts = async (req, res) => {
    try {
        const pagination = (0, pagination_1.parsePaginationParams)(req.query);
        const result = await (0, post_service_1.findPostAll)(pagination);
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: result.data,
            pagination: result.pagination
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: []
        });
    }
};
exports.getPosts = getPosts;
const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await (0, post_service_1.findPostById)(id);
        if (!post) {
            return res.status(404).json({
                status: 404,
                message: "Post not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: post
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
exports.getPost = getPost;
const createPost = async (req, res) => {
    const { userId, content } = req.body;
    const imageFile = req.file;
    try {
        const result = await (0, post_service_1.insertPost)(userId, { content, imageFile });
        return res.status(201).json({
            status: 201,
            message: "Post created successfully",
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
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: {}
        });
    }
};
exports.createPost = createPost;
const updatePost = async (req, res) => {
    const id = req.params.id;
    const { userId, content } = req.body;
    const imageFile = req.file;
    try {
        const result = await (0, post_service_1.updatePostById)(id, userId, { content, imageFile });
        return res.status(200).json({
            status: 200,
            message: "Post updated successfully",
            data: result
        });
    }
    catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({
                status: 404,
                message: error.message,
                data: {}
            });
        }
        else if (error.message === 'Unauthorized to update this post') {
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
exports.updatePost = updatePost;
const getPostsByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const pagination = (0, pagination_1.parsePaginationParams)(req.query);
        const result = await (0, post_service_1.findPostsByUserId)(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "User posts retrieved successfully",
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
exports.getPostsByUser = getPostsByUser;
const getSavedPostsByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const pagination = (0, pagination_1.parsePaginationParams)(req.query);
        const result = await (0, post_service_1.findSavedPostsByUserId)(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "Saved posts retrieved successfully",
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
exports.getSavedPostsByUser = getSavedPostsByUser;
const deletePost = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await (0, post_service_1.deletePostById)(id);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Post not found') {
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
exports.deletePost = deletePost;
//# sourceMappingURL=post.controller.js.map