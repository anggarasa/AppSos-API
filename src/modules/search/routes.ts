import { Router } from "express";
import { prisma } from "../../lib/prisma";

const router = Router();

router.get("/users", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);
  const users = await prisma.user.findMany({
    where: { OR: [{ username: { contains: q } }, { name: { contains: q } }] },
    take: 20,
  });
  res.json(users);
});

router.get("/posts", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);
  const posts = await prisma.post.findMany({
    where: { content: { contains: q } },
    take: 20,
  });
  res.json(posts);
});

export default router;
