import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, AuthPayload } from "../auth/middleware";
import { ResponseHelper, parsePagination } from "../../lib/response";

const router = Router();

router.post("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { postId } = req.params as { postId: string };
  try {
    await prisma.save.create({ data: { postId, userId } });
    ResponseHelper.success(res, null, "Post saved successfully", 201);
  } catch {
    ResponseHelper.conflict(res, "Post already saved");
  }
});

router.delete("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { postId } = req.params as { postId: string };
  await prisma.save.deleteMany({ where: { postId, userId } });
  ResponseHelper.success(res, null, "Post unsaved successfully");
});

router.get("/me", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { page, limit, skip } = parsePagination(req.query);

  const [saves, total] = await Promise.all([
    prisma.save.findMany({
      where: { userId },
      include: { post: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.save.count({
      where: { userId },
    }),
  ]);

  ResponseHelper.successWithPagination(
    res,
    saves,
    { page, limit, total },
    "Saved posts retrieved successfully"
  );
});

export default router;
