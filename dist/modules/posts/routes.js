"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const response_1 = require("../../lib/response");
const router = (0, express_1.Router)();
const createSchema = zod_1.z.object({
    content: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url().nullable().optional(),
});
router.post("/", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success)
        return response_1.ResponseHelper.validationError(res, parsed.error.flatten());
    const post = await prisma_1.prisma.post.create({
        data: {
            authorId: userId,
            content: parsed.data.content,
            imageUrl: parsed.data.imageUrl ?? null,
        },
    });
    response_1.ResponseHelper.success(res, post, "Post created successfully", 201);
});
router.get("/feed", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { page, limit, skip } = (0, response_1.parsePagination)(req.query);
    // Simple feed: posts from followed users + self
    const following = await prisma_1.prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
    });
    const ids = [userId, ...following.map((f) => f.followingId)];
    const [posts, total] = await Promise.all([
        prisma_1.prisma.post.findMany({
            where: { authorId: { in: ids } },
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { likes: true, comments: true, saves: true } },
            },
            skip,
            take: limit,
        }),
        prisma_1.prisma.post.count({
            where: { authorId: { in: ids } },
        }),
    ]);
    response_1.ResponseHelper.successWithPagination(res, posts, { page, limit, total }, "Feed retrieved successfully");
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
        return response_1.ResponseHelper.notFound(res, "Post not found");
    response_1.ResponseHelper.success(res, post, "Post retrieved successfully");
});
router.delete("/:postId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { postId } = req.params;
    const post = await prisma_1.prisma.post.findUnique({ where: { id: postId } });
    if (!post)
        return response_1.ResponseHelper.notFound(res, "Post not found");
    if (post.authorId !== userId)
        return response_1.ResponseHelper.forbidden(res, "You can only delete your own posts");
    await prisma_1.prisma.post.delete({ where: { id: post.id } });
    response_1.ResponseHelper.success(res, null, "Post deleted successfully");
});
exports.default = router;
//# sourceMappingURL=routes.js.map