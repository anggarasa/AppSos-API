"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const router = (0, express_1.Router)();
const createSchema = zod_1.z.object({ content: zod_1.z.string().min(1) });
router.post("/:postId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { postId } = req.params;
    const comment = await prisma_1.prisma.comment.create({
        data: { postId, authorId: userId, content: parsed.data.content },
    });
    const post = await prisma_1.prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
    });
    if (post && post.authorId !== userId) {
        await prisma_1.prisma.notification.create({
            data: {
                userId: post.authorId,
                actorId: userId,
                type: "comment",
                message: "commented on your post",
            },
        });
    }
    res.status(201).json(comment);
});
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    const comments = await prisma_1.prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: "asc" },
    });
    res.json(comments);
});
router.delete("/:commentId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { commentId } = req.params;
    const comment = await prisma_1.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment)
        return res.status(404).json({ error: "Not found" });
    if (comment.authorId !== userId)
        return res.status(403).json({ error: "Forbidden" });
    await prisma_1.prisma.comment.delete({ where: { id: comment.id } });
    res.json({ ok: true });
});
exports.default = router;
//# sourceMappingURL=routes.js.map