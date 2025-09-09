"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const router = (0, express_1.Router)();
router.get("/", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const notifications = await prisma_1.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
});
router.post("/read-all", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    await prisma_1.prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
    });
    res.json({ ok: true });
});
exports.default = router;
//# sourceMappingURL=routes.js.map