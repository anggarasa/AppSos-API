"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const db_1 = __importDefault(require("../config/db"));
const tokenUtils_1 = require("../utils/tokenUtils");
const authenticateToken = async (req, res, next) => {
    try {
        const token = (0, tokenUtils_1.extractTokenFromHeader)(req.headers['authorization']);
        if (!token) {
            res.status(401).json({
                status: 401,
                message: 'Access token required'
            });
            return;
        }
        const decoded = (0, tokenUtils_1.verifyAccessToken)(token);
        if (!decoded) {
            res.status(401).json({
                status: 401,
                message: 'Invalid or expired token'
            });
            return;
        }
        const user = await db_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                username: true,
                email: true,
                name: true
            }
        });
        if (!user) {
            res.status(401).json({
                status: 401,
                message: 'User not found'
            });
            return;
        }
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        next();
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        const token = (0, tokenUtils_1.extractTokenFromHeader)(req.headers['authorization']);
        if (!token) {
            next();
            return;
        }
        const decoded = (0, tokenUtils_1.verifyAccessToken)(token);
        if (!decoded) {
            next();
            return;
        }
        const user = await db_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                username: true,
                email: true,
                name: true
            }
        });
        if (user) {
            req.user = {
                id: user.id,
                username: user.username,
                email: user.email
            };
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map