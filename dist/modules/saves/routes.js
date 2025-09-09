"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const middleware_1 = require("../auth/middleware");
const router = (0, express_1.Router)();
router.post("/:postId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { postId } = req.params;
    try {
        await prisma_1.prisma.save.create({ data: { postId, userId } });
        res.status(201).json({ ok: true });
    }
    catch {
        res.status(409).json({ error: "Already saved" });
    }
});
router.delete("/:postId", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const { postId } = req.params;
    await prisma_1.prisma.save.deleteMany({ where: { postId, userId } });
    res.json({ ok: true });
});
router.get("/me", middleware_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const saves = await prisma_1.prisma.save.findMany({
        where: { userId },
        include: { post: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(saves);
});
exports.default = router;
//# sourceMappingURL=routes.js.map