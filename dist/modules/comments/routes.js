"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const response_1 = require("../../lib/response");
const router = (0, express_1.Router)();
const createSchema = zod_1.z.object({ content: zod_1.z.string().min(1) });
router.post("/:postId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success)
        return response_1.ResponseHelper.validationError(res, parsed.error.flatten());
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
    response_1.ResponseHelper.success(res, comment, "Comment created successfully", 201);
});
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    const { page, limit, skip } = (0, response_1.parsePagination)(req.query);
    const [comments, total] = await Promise.all([
        prisma_1.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "asc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.comment.count({
            where: { postId },
        }),
    ]);
    response_1.ResponseHelper.successWithPagination(res, comments, { page, limit, total }, "Comments retrieved successfully");
});
router.delete("/:commentId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { commentId } = req.params;
    const comment = await prisma_1.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment)
        return response_1.ResponseHelper.notFound(res, "Comment not found");
    if (comment.authorId !== userId)
        return response_1.ResponseHelper.forbidden(res, "You can only delete your own comments");
    await prisma_1.prisma.comment.delete({ where: { id: comment.id } });
    response_1.ResponseHelper.success(res, null, "Comment deleted successfully");
});
exports.default = router;
//# sourceMappingURL=routes.js.map