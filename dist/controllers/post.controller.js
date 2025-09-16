"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.createPost = exports.getPost = exports.getPosts = void 0;
const post_service_1 = require("../services/post.service");
const getPosts = async (_, res) => {
    try {
        const posts = await (0, post_service_1.findPostAll)();
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: posts
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