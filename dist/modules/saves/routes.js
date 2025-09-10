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
        await prisma_1.prisma.save.create({ data: { postId, userId } });
        response_1.ResponseHelper.success(res, null, "Post saved successfully", 201);
    }
    catch {
        response_1.ResponseHelper.conflict(res, "Post already saved");
    }
});
router.delete("/:postId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { postId } = req.params;
    await prisma_1.prisma.save.deleteMany({ where: { postId, userId } });
    response_1.ResponseHelper.success(res, null, "Post unsaved successfully");
});
router.get("/me", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { page, limit, skip } = (0, response_1.parsePagination)(req.query);
    const [saves, total] = await Promise.all([
        prisma_1.prisma.save.findMany({
            where: { userId },
            include: { post: true },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.save.count({
            where: { userId },
        }),
    ]);
    response_1.ResponseHelper.successWithPagination(res, saves, { page, limit, total }, "Saved posts retrieved successfully");
});
exports.default = router;
//# sourceMappingURL=routes.js.map