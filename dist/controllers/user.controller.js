"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserActivityFeed = exports.searchUsersList = exports.getUserByUsername = exports.getUserProfileWithStats = exports.updateUser = exports.findUser = exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
const pagination_1 = require("../utils/pagination");
const getUsers = async (req, res) => {
    try {
        const pagination = (0, pagination_1.parsePaginationParams)(req.query);
        const result = await (0, user_service_1.findAllUsers)(pagination);
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
            message: "Internal Server Error"
        });
    }
};
exports.getUsers = getUsers;
const findUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await (0, user_service_1.findUserById)(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: user
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};
exports.findUser = findUser;
const updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, username, email, bio } = req.body;
    const avatar = req.file;
    console.log('Update request for user:', id);
    console.log('Request body:', { name, username, email, bio });
    console.log('Avatar file:', avatar ? 'Present' : 'Not present');
    try {
        const updatedUser = await (0, user_service_1.updateUserById)(id, { name, username, email, bio, avatar });
        return res.status(200).json({
            status: 200,
            message: "User update successful",
            data: updatedUser
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({
                status: 404,
                message: error.message
            });
        }
        else if (error.message === 'Username already exists' || error.message === 'Email already exists') {
            return res.status(409).json({
                status: 409,
                message: error.message
            });
        }
        else if (error.message.includes('Supabase configuration')) {
            return res.status(500).json({
                status: 500,
                message: "Server configuration error"
            });
        }
        else if (error.message.includes('Failed to upload avatar')) {
            return res.status(500).json({
                status: 500,
                message: "Avatar upload failed",
                error: error.message
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
            });
        }
    }
};
exports.updateUser = updateUser;
const getUserProfileWithStats = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await (0, user_service_1.findUserProfileWithStats)(id);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "User profile retrieved successfully",
            data: user
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
exports.getUserProfileWithStats = getUserProfileWithStats;
const getUserByUsername = async (req, res) => {
    const username = req.params.username;
    try {
        const user = await (0, user_service_1.findUserByUsername)(username);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "User retrieved successfully",
            data: user
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
exports.getUserByUsername = getUserByUsername;
const searchUsersList = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({
            status: 400,
            message: "Search query is required"
        });
    }
    try {
        const pagination = (0, pagination_1.parsePaginationParams)(req.query);
        const result = await (0, user_service_1.searchUsers)(query, pagination);
        return res.status(200).json({
            status: 200,
            message: "Users found successfully",
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
exports.searchUsersList = searchUsersList;
const getUserActivityFeed = async (req, res) => {
    const userId = req.params.userId;
    try {
        const pagination = (0, pagination_1.parsePaginationParams)(req.query);
        const result = await (0, user_service_1.getUserActivity)(userId, pagination);
        return res.status(200).json({
            status: 200,
            message: "User activity retrieved successfully",
            data: result.data,
            pagination: result.pagination
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
exports.getUserActivityFeed = getUserActivityFeed;
const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await (0, user_service_1.deleteUserById)(id);
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.message === 'User not found') {
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
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map