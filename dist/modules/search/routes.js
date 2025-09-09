"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
router.get("/users", async (req, res) => {
    const q = String(req.query.q || "").trim();
    if (!q)
        return res.json([]);
    const users = await prisma_1.prisma.user.findMany({
        where: { OR: [{ username: { contains: q } }, { name: { contains: q } }] },
        take: 20,
    });
    res.json(users);
});
router.get("/posts", async (req, res) => {
    const q = String(req.query.q || "").trim();
    if (!q)
        return res.json([]);
    const posts = await prisma_1.prisma.post.findMany({
        where: { content: { contains: q } },
        take: 20,
    });
    res.json(posts);
});
exports.default = router;
//# sourceMappingURL=routes.js.map