"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreatePost = exports.validateLogin = exports.validateUpdateUser = exports.validateCreateUser = void 0;
const validateCreateUser = (req, res, next) => {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        res.status(400).json({
            message: "All fields (name, username, email, password) are required"
        });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({
            message: "Invalid email format"
        });
        return;
    }
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
        res.status(400).json({
            message: "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
        });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({
            message: "Password must be at least 6 characters long"
        });
        return;
    }
    if (name.trim().length < 2 || name.trim().length > 50) {
        res.status(400).json({
            message: "Name must be between 2 and 50 characters long"
        });
        return;
    }
    next();
};
exports.validateCreateUser = validateCreateUser;
const validateUpdateUser = (req, res, next) => {
    const { name, username, email, bio, avatarUrl } = req.body;
    const hasAvatarFile = Boolean(req.file);
    if (!name && !username && !email && !bio && !avatarUrl && !hasAvatarFile) {
        res.status(400).json({
            message: "At least one field (or avatar file) must be provided for update"
        });
        return;
    }
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({
                message: "Invalid email format"
            });
            return;
        }
    }
    if (username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            res.status(400).json({
                message: "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
            });
            return;
        }
    }
    if (name) {
        if (name.trim().length < 2 || name.trim().length > 50) {
            res.status(400).json({
                message: "Name must be between 2 and 50 characters long"
            });
            return;
        }
    }
    if (bio && bio.length > 500) {
        res.status(400).json({
            message: "Bio must be less than 500 characters"
        });
        return;
    }
    if (avatarUrl) {
        try {
            new URL(avatarUrl);
        }
        catch {
            res.status(400).json({
                message: "Invalid avatar URL format"
            });
            return;
        }
    }
    next();
};
exports.validateUpdateUser = validateUpdateUser;
const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            status: 400,
            message: "Username and password are required"
        });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({
            status: 400,
            message: "Password must be at least 6 characters long"
        });
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
const validateCreatePost = (req, res, next) => {
    const { userId, content } = req.body;
    if (!userId) {
        res.status(400).json({
            status: 400,
            message: "User ID is required"
        });
        return;
    }
    if (!content) {
        res.status(400).json({
            status: 400,
            message: "Content is required"
        });
        return;
    }
    if (content.trim().length < 1) {
        res.status(400).json({
            status: 400,
            message: "Content cannot be empty"
        });
        return;
    }
    if (content.length > 2000) {
        res.status(400).json({
            status: 400,
            message: "Content must be less than 2000 characters"
        });
        return;
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
        res.status(400).json({
            status: 400,
            message: "Invalid user ID format"
        });
        return;
    }
    next();
};
exports.validateCreatePost = validateCreatePost;
//# sourceMappingURL=validation.js.map