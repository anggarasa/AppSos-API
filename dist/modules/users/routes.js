"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const response_1 = require("../../lib/response");
const router = (0, express_1.Router)();
router.get("/me", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return response_1.ResponseHelper.notFound(res, "User not found");
    response_1.ResponseHelper.success(res, {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
    }, "User profile retrieved successfully");
});
const updateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    bio: zod_1.z.string().max(500).nullable().optional(),
    avatarUrl: zod_1.z.string().url().nullable().optional(),
});
router.put("/me", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success)
        return response_1.ResponseHelper.validationError(res, parsed.error.flatten());
    const updated = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: parsed.data,
    });
    response_1.ResponseHelper.success(res, {
        id: updated.id,
        email: updated.email,
        username: updated.username,
        name: updated.name,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
    }, "User profile updated successfully");
});
router.get("/:username", async (req, res) => {
    const { username } = req.params;
    const user = await prisma_1.prisma.user.findUnique({ where: { username } });
    if (!user)
        return response_1.ResponseHelper.notFound(res, "User not found");
    const followers = await prisma_1.prisma.follow.count({
        where: { followingId: user.id },
    });
    const following = await prisma_1.prisma.follow.count({
        where: { followerId: user.id },
    });
    response_1.ResponseHelper.success(res, {
        id: user.id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        followers,
        following,
    }, "User profile retrieved successfully");
});
router.post("/:userId/follow", middleware_1.requireAuth, async (req, res) => {
    const { userId: actorId } = req.auth;
    const { userId } = req.params;
    if (actorId === userId)
        return response_1.ResponseHelper.error(res, "Cannot follow yourself", 400);
    try {
        await prisma_1.prisma.follow.create({
            data: { followerId: actorId, followingId: userId },
        });
    }
    catch {
        return response_1.ResponseHelper.conflict(res, "Already following this user");
    }
    await prisma_1.prisma.notification.create({
        data: {
            userId,
            actorId: actorId,
            type: "follow",
            message: "started following you",
        },
    });
    response_1.ResponseHelper.success(res, null, "User followed successfully", 201);
});
router.delete("/:userId/follow", middleware_1.requireAuth, async (req, res) => {
    const { userId: actorId } = req.auth;
    const { userId } = req.params;
    await prisma_1.prisma.follow.deleteMany({
        where: { followerId: actorId, followingId: userId },
    });
    response_1.ResponseHelper.success(res, null, "User unfollowed successfully");
});
router.get("/:userId/posts", async (req, res) => {
    const { userId } = req.params;
    const { page, limit, skip } = (0, response_1.parsePagination)(req.query);
    const [posts, total] = await Promise.all([
        prisma_1.prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { likes: true, comments: true, saves: true } },
            },
            skip,
            take: limit,
        }),
        prisma_1.prisma.post.count({
            where: { authorId: userId },
        }),
    ]);
    response_1.ResponseHelper.successWithPagination(res, posts, { page, limit, total }, "User posts retrieved successfully");
});
exports.default = router;
//# sourceMappingURL=routes.js.map