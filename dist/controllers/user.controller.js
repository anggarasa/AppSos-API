"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.findUser = exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
const getUsers = async (_, res) => {
    try {
        const users = await (0, user_service_1.findAllUsers)();
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: users,
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