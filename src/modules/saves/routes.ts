import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, AuthPayload } from "../auth/middleware";

const router = Router();

router.post("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { postId } = req.params as { postId: string };
  try {
    await prisma.save.create({ data: { postId, userId } });
    res.status(201).json({ ok: true });
  } catch {
    res.status(409).json({ error: "Already saved" });
  }
});

router.delete("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { postId } = req.params as { postId: string };
  await prisma.save.deleteMany({ where: { postId, userId } });
  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const saves = await prisma.save.findMany({
    where: { userId },
    include: { post: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(saves);
});

export default router;
