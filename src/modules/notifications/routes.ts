import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../auth/middleware";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth;
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  res.json(notifications);
});

router.post("/read-all", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth;
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  res.json({ ok: true });
});

export default router;
