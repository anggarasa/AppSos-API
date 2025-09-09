import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, AuthPayload } from "../auth/middleware";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
  });
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().max(500).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

router.put("/me", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const updated = await prisma.user.update({
    where: { id: userId },
    data: parsed.data as any,
  });
  res.json({
    id: updated.id,
    email: updated.email,
    username: updated.username,
    name: updated.name,
    bio: updated.bio,
    avatarUrl: updated.avatarUrl,
  });
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(404).json({ error: "Not found" });
  const followers = await prisma.follow.count({
    where: { followingId: user.id },
  });
  const following = await prisma.follow.count({
    where: { followerId: user.id },
  });
  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    followers,
    following,
  });
});

router.post("/:userId/follow", requireAuth, async (req, res) => {
  const { userId: actorId } = (req as any).auth as AuthPayload;
  const { userId } = req.params as { userId: string };
  if (actorId === userId)
    return res.status(400).json({ error: "Cannot follow yourself" });
  try {
    await prisma.follow.create({
      data: { followerId: actorId, followingId: userId },
    });
  } catch {
    return res.status(409).json({ error: "Already following" });
  }
  await prisma.notification.create({
    data: {
      userId,
      actorId: actorId,
      type: "follow",
      message: "started following you",
    },
  });
  res.status(201).json({ ok: true });
});

router.delete("/:userId/follow", requireAuth, async (req, res) => {
  const { userId: actorId } = (req as any).auth as AuthPayload;
  const { userId } = req.params as { userId: string };
  await prisma.follow.deleteMany({
    where: { followerId: actorId, followingId: userId },
  });
  res.json({ ok: true });
});

router.get("/:userId/posts", async (req, res) => {
  const { userId } = req.params as { userId: string };
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { likes: true, comments: true, saves: true } },
    },
  });
  res.json(posts);
});

export default router;
