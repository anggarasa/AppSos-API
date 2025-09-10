import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAuth, AuthPayload } from "../auth/middleware";
import { ResponseHelper } from "../../lib/response";

const router = Router();

router.post("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { postId } = req.params as { postId: string };
  try {
    await prisma.like.create({ data: { postId, userId } });
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (post && post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId: userId,
          type: "like",
          message: "liked your post",
        },
      });
    }
    ResponseHelper.success(res, null, "Post liked successfully", 201);
  } catch {
    ResponseHelper.conflict(res, "Post already liked");
  }
});

router.delete("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { postId } = req.params as { postId: string };
  await prisma.like.deleteMany({ where: { postId, userId } });
  ResponseHelper.success(res, null, "Post unliked successfully");
});

export default router;
