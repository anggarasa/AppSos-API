import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, AuthPayload } from "../auth/middleware";

const router = Router();

const createSchema = z.object({
  content: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
});

router.post("/", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const post = await prisma.post.create({
    data: {
      authorId: userId,
      content: parsed.data.content,
      imageUrl: parsed.data.imageUrl ?? null,
    },
  });
  res.status(201).json(post);
});

router.get("/feed", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  // Simple feed: posts from followed users + self
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const ids = [userId, ...following.map((f) => f.followingId)];
  const posts = await prisma.post.findMany({
    where: { authorId: { in: ids } },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { likes: true, comments: true, saves: true } },
    },
  });
  res.json(posts);
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params as { postId: string };
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      comments: true,
      _count: { select: { likes: true, comments: true, saves: true } },
    },
  });
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json(post);
});

router.delete("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { postId } = req.params as { postId: string };
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return res.status(404).json({ error: "Not found" });
  if (post.authorId !== userId)
    return res.status(403).json({ error: "Forbidden" });
  await prisma.post.delete({ where: { id: post.id } });
  res.json({ ok: true });
});

export default router;
