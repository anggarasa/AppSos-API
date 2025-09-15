"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const result = await (0, auth_service_1.registerUser)({ name, username, email, password });
        return res.status(201).json({
            status: 201,
            message: "User registration successful",
            data: result,
        });
    }
    catch (error) {
        if (error.message === 'Username or Email already exists') {
            return res.status(409).json({
                status: 409,
                message: error.message
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
};
exports.register = register;
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await (0, auth_service_1.loginUser)({ username, password });
        return res.status(200).json({
            status: 200,
            message: "Login successful",
            data: result,
        });
    }
    catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({
                status: 401,
                message: error.message
            });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
};
exports.login = login;
const logout = async (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "Logout successful"
    });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map