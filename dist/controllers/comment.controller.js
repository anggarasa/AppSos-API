"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = void 0;
const comment_service_1 = require("../services/comment.service");
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