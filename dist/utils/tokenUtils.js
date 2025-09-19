"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.generateTokenPair = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_jwt_secret';
const generateAccessToken = (userId, username) => {
    const payload = {
        userId,
        username,
        type: 'access'
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: '15m'
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId, username) => {
    const payload = {
        userId,
        username,
        type: 'refresh'
    };
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.type !== 'access') {
            return null;
        }
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
        if (decoded.type !== 'refresh') {
            return null;
        }
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateTokenPair = (userId, username) => {
    const accessToken = (0, exports.generateAccessToken)(userId, username);
    const refreshToken = (0, exports.generateRefreshToken)(userId, username);
    return {
        accessToken,
        refreshToken
    };
};
exports.generateTokenPair = generateTokenPair;
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
};
exports.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=tokenUtils.js.map