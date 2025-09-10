"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const response_1 = require("../../lib/response");
const router = (0, express_1.Router)();
router.get("/users", async (req, res) => {
    const q = String(req.query.q || "").trim();
    if (!q)
        return response_1.ResponseHelper.success(res, [], "No search query provided");
    const { page, limit, skip } = (0, response_1.parsePagination)(req.query);
    const [users, total] = await Promise.all([
        prisma_1.prisma.user.findMany({
            where: { OR: [{ username: { contains: q } }, { name: { contains: q } }] },
            skip,
            take: limit,
        }),
        prisma_1.prisma.user.count({
            where: { OR: [{ username: { contains: q } }, { name: { contains: q } }] },
        }),
    ]);
    response_1.ResponseHelper.successWithPagination(res, users, { page, limit, total }, "Users search results");
});
router.get("/posts", async (req, res) => {
    const q = String(req.query.q || "").trim();
    if (!q)
        return response_1.ResponseHelper.success(res, [], "No search query provided");
    const { page, limit, skip } = (0, response_1.parsePagination)(req.query);
    const [posts, total] = await Promise.all([
        prisma_1.prisma.post.findMany({
            where: { content: { contains: q } },
            skip,
            take: limit,
        }),
        prisma_1.prisma.post.count({
            where: { content: { contains: q } },
        }),
    ]);
    response_1.ResponseHelper.successWithPagination(res, posts, { page, limit, total }, "Posts search results");
});
exports.default = router;
//# sourceMappingURL=routes.js.map