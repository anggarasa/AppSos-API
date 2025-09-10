"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const response_1 = require("../../lib/response");
const router = (0, express_1.Router)();
router.get("/", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { page, limit, skip } = (0, response_1.parsePagination)(req.query);
    const [notifications, total] = await Promise.all([
        prisma_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma_1.prisma.notification.count({
            where: { userId },
        }),
    ]);
    response_1.ResponseHelper.successWithPagination(res, notifications, { page, limit, total }, "Notifications retrieved successfully");
});
router.post("/read-all", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    await prisma_1.prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
    });
    response_1.ResponseHelper.success(res, null, "All notifications marked as read");
});
exports.default = router;
//# sourceMappingURL=routes.js.map