"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unSave = exports.savePost = void 0;
const save_service_1 = require("../services/save.service");
const savePost = async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const result = await (0, save_service_1.insertSave)(userId, postId);
        return res.status(201).json({
            status: 201,
            message: "Save post successfully",
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
exports.savePost = savePost;
const unSave = async (req, res) => {
    const { userId, postId } = req.body;
    try {
        const result = await (0, save_service_1.deleteSaveByUserIdAndPostId)(userId, postId);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'Save not found') {
            return res.status(404).json({
                status: 404,
                message: error.message
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
exports.unSave = unSave;
//# sourceMappingURL=save.controller.js.map