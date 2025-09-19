"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tokenUtils_1 = require("../utils/tokenUtils");
const registerUser = async (data) => {
    try {
        const existingUsername = await db_1.default.user.findUnique({ where: { username: data.username } });
        const existingEmail = await db_1.default.user.findUnique({ where: { email: data.email } });
        if (existingEmail || existingUsername) {
            throw new Error('Username or Email already exists');
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const newUser = await db_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                username: data.username,
                password: passwordHash,
            }
        });
        const { accessToken, refreshToken } = (0, tokenUtils_1.generateTokenPair)(newUser.id, newUser.username);
        return {
            accessToken,
            refreshToken,
            user: {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
            },
        };
    }
    catch (error) {
        throw error;
    }
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    try {
        const user = await db_1.default.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.username }
                ]
            }
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const { accessToken, refreshToken } = (0, tokenUtils_1.generateTokenPair)(user.id, user.username);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatarUrl: user.avatarUrl,
            },
        };
    }
    catch (error) {
        throw error;
    }
};
exports.loginUser = loginUser;
const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = (0, tokenUtils_1.verifyRefreshToken)(refreshToken);
        if (!decoded) {
            throw new Error('Invalid refresh token');
        }
        const user = await db_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                bio: true,
                avatarUrl: true
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const { accessToken } = (0, tokenUtils_1.generateTokenPair)(user.id, user.username);
        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatarUrl: user.avatarUrl,
            },
        };
    }
    catch (error) {
        throw error;
    }
};
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=auth.service.js.map