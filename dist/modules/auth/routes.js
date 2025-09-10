"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const env_1 = require("../../config/env");
const response_1 = require("../../lib/response");
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3),
    name: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6),
});
router.post("/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success)
        return response_1.ResponseHelper.validationError(res, parsed.error.flatten());
    const { email, username, name, password } = parsed.data;
    const existing = await prisma_1.prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
    });
    if (existing)
        return response_1.ResponseHelper.conflict(res, "Email or username already in use");
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: { email, username, name, passwordHash },
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.jwtSecret, {
        expiresIn: "7d",
    });
    response_1.ResponseHelper.success(res, { token, user: { id: user.id, email, username, name } }, "User registered successfully", 201);
});
const loginSchema = zod_1.z.object({
    emailOrUsername: zod_1.z.string(),
    password: zod_1.z.string().min(6),
});
router.post("/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
        return response_1.ResponseHelper.validationError(res, parsed.error.flatten());
    const { emailOrUsername, password } = parsed.data;
    const user = await prisma_1.prisma.user.findFirst({
        where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] },
    });
    if (!user)
        return response_1.ResponseHelper.unauthorized(res, "Invalid credentials");
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok)
        return response_1.ResponseHelper.unauthorized(res, "Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.jwtSecret, {
        expiresIn: "7d",
    });
    response_1.ResponseHelper.success(res, {
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
        },
    }, "Login successful");
});
exports.default = router;
//# sourceMappingURL=routes.js.map