import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, AuthPayload } from "../auth/middleware";
import { ResponseHelper, parsePagination } from "../../lib/response";

const router = Router();

const createSchema = z.object({ content: z.string().min(1) });

router.post("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success)
    return ResponseHelper.validationError(res, parsed.error.flatten());
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
  ResponseHelper.success(res, comment, "Comment created successfully", 201);
});

router.get("/:postId", async (req, res) => {
  const { postId } = req.params as { postId: string };
  const { page, limit, skip } = parsePagination(req.query);

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    }),
    prisma.comment.count({
      where: { postId },
    }),
  ]);

  ResponseHelper.successWithPagination(
    res,
    comments,
    { page, limit, total },
    "Comments retrieved successfully"
  );
});

router.delete("/:commentId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { commentId } = req.params as { commentId: string };
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return ResponseHelper.notFound(res, "Comment not found");
  if (comment.authorId !== userId)
    return ResponseHelper.forbidden(
      res,
      "You can only delete your own comments"
    );
  await prisma.comment.delete({ where: { id: comment.id } });
  ResponseHelper.success(res, null, "Comment deleted successfully");
});

export default router;
