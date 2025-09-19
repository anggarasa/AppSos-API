"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unSave = exports.getSave = exports.getPostSaveCount = exports.checkUserSave = exports.getSavedPostsByUser = exports.savePost = void 0;
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
const getSavedPostsByUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const savedPosts = await (0, save_service_1.findSavedPostsByUserId)(userId);
        return res.status(200).json({
            status: 200,
            message: "Saved posts retrieved successfully",
            data: savedPosts
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
const checkUserSave = async (req, res) => {
    const { userId, postId } = req.params;
    try {
        const hasSaved = await (0, save_service_1.hasUserSavedPost)(userId, postId);
        return res.status(200).json({
            status: 200,
            message: "User save status retrieved successfully",
            data: { hasSaved }
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
exports.checkUserSave = checkUserSave;
const getPostSaveCount = async (req, res) => {
    const postId = req.params.postId;
    try {
        const count = await (0, save_service_1.getSaveCount)(postId);
        return res.status(200).json({
            status: 200,
            message: "Save count retrieved successfully",
            data: { saveCount: count }
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
exports.getPostSaveCount = getPostSaveCount;
const getSave = async (req, res) => {
    const id = req.params.id;
    try {
        const save = await (0, save_service_1.findSaveById)(id);
        if (!save) {
            return res.status(404).json({
                status: 404,
                message: "Save not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Save retrieved successfully",
            data: save
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
exports.getSave = getSave;
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