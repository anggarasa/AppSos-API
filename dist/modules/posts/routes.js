"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const router = (0, express_1.Router)();
const createSchema = zod_1.z.object({
    content: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url().nullable().optional(),
});
router.post("/", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const post = await prisma_1.prisma.post.create({
        data: {
            authorId: userId,
            content: parsed.data.content,
            imageUrl: parsed.data.imageUrl ?? null,
        },
    });
    res.status(201).json(post);
});
router.get("/feed", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    // Simple feed: posts from followed users + self
    const following = await prisma_1.prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
    });
    const ids = [userId, ...following.map((f) => f.followingId)];
    const posts = await prisma_1.prisma.post.findMany({
        where: { authorId: { in: ids } },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { likes: true, comments: true, saves: true } },
        },
    });
    res.json(posts);
});
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await prisma_1.prisma.post.findUnique({
        where: { id: postId },
        include: {
            comments: true,
            _count: { select: { likes: true, comments: true, saves: true } },
        },
    });
    if (!post)
        return res.status(404).json({ error: "Not found" });
    res.json(post);
});
router.delete("/:postId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { postId } = req.params;
    const post = await prisma_1.prisma.post.findUnique({ where: { id: postId } });
    if (!post)
        return res.status(404).json({ error: "Not found" });
    if (post.authorId !== userId)
        return res.status(403).json({ error: "Forbidden" });
    await prisma_1.prisma.post.delete({ where: { id: post.id } });
    res.json({ ok: true });
});
exports.default = router;
//# sourceMappingURL=routes.js.map