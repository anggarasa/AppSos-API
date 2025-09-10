"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const response_1 = require("../../lib/response");
const router = (0, express_1.Router)();
router.post("/:postId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { postId } = req.params;
    try {
        await prisma_1.prisma.like.create({ data: { postId, userId } });
        const post = await prisma_1.prisma.post.findUnique({
            where: { id: postId },
            select: { authorId: true },
        });
        if (post && post.authorId !== userId) {
            await prisma_1.prisma.notification.create({
                data: {
                    userId: post.authorId,
                    actorId: userId,
                    type: "like",
                    message: "liked your post",
                },
            });
        }
        response_1.ResponseHelper.success(res, null, "Post liked successfully", 201);
    }
    catch {
        response_1.ResponseHelper.conflict(res, "Post already liked");
    }
});
router.delete("/:postId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { postId } = req.params;
    await prisma_1.prisma.like.deleteMany({ where: { postId, userId } });
    response_1.ResponseHelper.success(res, null, "Post unliked successfully");
});
exports.default = router;
//# sourceMappingURL=routes.js.map