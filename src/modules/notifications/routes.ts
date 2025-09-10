import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../auth/middleware";
import { ResponseHelper, parsePagination } from "../../lib/response";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth;
  const { page, limit, skip } = parsePagination(req.query);

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({
      where: { userId },
    }),
  ]);

  ResponseHelper.successWithPagination(
    res,
    notifications,
    { page, limit, total },
    "Notifications retrieved successfully"
  );
});

router.post("/read-all", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth;
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  ResponseHelper.success(res, null, "All notifications marked as read");
});

export default router;
