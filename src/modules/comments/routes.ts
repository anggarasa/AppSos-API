import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, AuthPayload } from "../auth/middleware";

const router = Router();

const createSchema = z.object({ content: z.string().min(1) });

router.post("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { postId } = req.params as { postId: string };
  const comment = await prisma.comment.create({
    data: { postId, authorId: userId, content: parsed.data.content },
  });
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (post && post.authorId !== userId) {
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        actorId: userId,
        type: "comment",
        message: "commented on your post",
      },
    });
  }
  res.status(201).json(comment);
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params as { postId: string };
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
  });
  res.json(comments);
});

router.delete("/:commentId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { commentId } = req.params as { commentId: string };
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return res.status(404).json({ error: "Not found" });
  if (comment.authorId !== userId)
    return res.status(403).json({ error: "Forbidden" });
  await prisma.comment.delete({ where: { id: comment.id } });
  res.json({ ok: true });
});

export default router;
