"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        const token = jsonwebtoken_1.default.sign({
            userId: newUser.id,
            username: newUser.username,
        }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
        return {
            token,
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
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            username: user.username,
        }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '24h' });
        return {
            token,
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
//# sourceMappingURL=auth.service.js.map