"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const router = (0, express_1.Router)();
router.get("/me", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return res.status(404).json({ error: "Not found" });
    res.json({
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
    });
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
        return res.status(400).json({ error: parsed.error.flatten() });
    const updated = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: parsed.data,
    });
    res.json({
        id: updated.id,
        email: updated.email,
        username: updated.username,
        name: updated.name,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
    });
});
router.get("/:username", async (req, res) => {
    const { username } = req.params;
    const user = await prisma_1.prisma.user.findUnique({ where: { username } });
    if (!user)
        return res.status(404).json({ error: "Not found" });
    const followers = await prisma_1.prisma.follow.count({
        where: { followingId: user.id },
    });
    const following = await prisma_1.prisma.follow.count({
        where: { followerId: user.id },
    });
    res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        followers,
        following,
    });
});
router.post("/:userId/follow", middleware_1.requireAuth, async (req, res) => {
    const { userId: actorId } = req.auth;
    const { userId } = req.params;
    if (actorId === userId)
        return res.status(400).json({ error: "Cannot follow yourself" });
    try {
        await prisma_1.prisma.follow.create({
            data: { followerId: actorId, followingId: userId },
        });
    }
    catch {
        return res.status(409).json({ error: "Already following" });
    }
    await prisma_1.prisma.notification.create({
        data: {
            userId,
            actorId: actorId,
            type: "follow",
            message: "started following you",
        },
    });
    res.status(201).json({ ok: true });
});
router.delete("/:userId/follow", middleware_1.requireAuth, async (req, res) => {
    const { userId: actorId } = req.auth;
    const { userId } = req.params;
    await prisma_1.prisma.follow.deleteMany({
        where: { followerId: actorId, followingId: userId },
    });
    res.json({ ok: true });
});
router.get("/:userId/posts", async (req, res) => {
    const { userId } = req.params;
    const posts = await prisma_1.prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { likes: true, comments: true, saves: true } },
        },
    });
    res.json(posts);
});
exports.default = router;
//# sourceMappingURL=routes.js.map