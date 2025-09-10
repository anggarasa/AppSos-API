import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, AuthPayload } from "../auth/middleware";
import { ResponseHelper, parsePagination } from "../../lib/response";

const router = Router();

const createSchema = z.object({
  content: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
});

router.post("/", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success)
    return ResponseHelper.validationError(res, parsed.error.flatten());
  const post = await prisma.post.create({
    data: {
      authorId: userId,
      content: parsed.data.content,
      imageUrl: parsed.data.imageUrl ?? null,
    },
  });
  ResponseHelper.success(res, post, "Post created successfully", 201);
});

router.get("/feed", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { page, limit, skip } = parsePagination(req.query);

  // Simple feed: posts from followed users + self
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const ids = [userId, ...following.map((f) => f.followingId)];

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: { in: ids } },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { likes: true, comments: true, saves: true } },
      },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: { authorId: { in: ids } },
    }),
  ]);

  ResponseHelper.successWithPagination(
    res,
    posts,
    { page, limit, total },
    "Feed retrieved successfully"
  );
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
  if (!post) return ResponseHelper.notFound(res, "Post not found");
  ResponseHelper.success(res, post, "Post retrieved successfully");
});

router.delete("/:postId", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const { postId } = req.params as { postId: string };
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return ResponseHelper.notFound(res, "Post not found");
  if (post.authorId !== userId)
    return ResponseHelper.forbidden(res, "You can only delete your own posts");
  await prisma.post.delete({ where: { id: post.id } });
  ResponseHelper.success(res, null, "Post deleted successfully");
});

export default router;
