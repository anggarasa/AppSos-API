import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { ResponseHelper, parsePagination } from "../../lib/response";

const router = Router();

router.get("/users", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return ResponseHelper.success(res, [], "No search query provided");

  const { page, limit, skip } = parsePagination(req.query);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { OR: [{ username: { contains: q } }, { name: { contains: q } }] },
      skip,
      take: limit,
    }),
    prisma.user.count({
      where: { OR: [{ username: { contains: q } }, { name: { contains: q } }] },
    }),
  ]);

  ResponseHelper.successWithPagination(
    res,
    users,
    { page, limit, total },
    "Users search results"
  );
});

router.get("/posts", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return ResponseHelper.success(res, [], "No search query provided");

  const { page, limit, skip } = parsePagination(req.query);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { content: { contains: q } },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: { content: { contains: q } },
    }),
  ]);

  ResponseHelper.successWithPagination(
    res,
    posts,
    { page, limit, total },
    "Posts search results"
  );
});

export default router;
