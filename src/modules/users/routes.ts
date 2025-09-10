import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth, AuthPayload } from "../auth/middleware";
import { ResponseHelper, parsePagination } from "../../lib/response";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const { userId } = (req as any).auth as AuthPayload;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return ResponseHelper.notFound(res, "User not found");
  ResponseHelper.success(
    res,
    {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    },
    "User profile retrieved successfully"
  );
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
    return ResponseHelper.validationError(res, parsed.error.flatten());
  const updated = await prisma.user.update({
    where: { id: userId },
    data: parsed.data as any,
  });
  ResponseHelper.success(
    res,
    {
      id: updated.id,
      email: updated.email,
      username: updated.username,
      name: updated.name,
      bio: updated.bio,
      avatarUrl: updated.avatarUrl,
    },
    "User profile updated successfully"
  );
});

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return ResponseHelper.notFound(res, "User not found");
  const followers = await prisma.follow.count({
    where: { followingId: user.id },
  });
  const following = await prisma.follow.count({
    where: { followerId: user.id },
  });
  ResponseHelper.success(
    res,
    {
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      followers,
      following,
    },
    "User profile retrieved successfully"
  );
});

router.post("/:userId/follow", requireAuth, async (req, res) => {
  const { userId: actorId } = (req as any).auth as AuthPayload;
  const { userId } = req.params as { userId: string };
  if (actorId === userId)
    return ResponseHelper.error(res, "Cannot follow yourself", 400);
  try {
    await prisma.follow.create({
      data: { followerId: actorId, followingId: userId },
    });
  } catch {
    return ResponseHelper.conflict(res, "Already following this user");
  }
  await prisma.notification.create({
    data: {
      userId,
      actorId: actorId,
      type: "follow",
      message: "started following you",
    },
  });
  ResponseHelper.success(res, null, "User followed successfully", 201);
});

router.delete("/:userId/follow", requireAuth, async (req, res) => {
  const { userId: actorId } = (req as any).auth as AuthPayload;
  const { userId } = req.params as { userId: string };
  await prisma.follow.deleteMany({
    where: { followerId: actorId, followingId: userId },
  });
  ResponseHelper.success(res, null, "User unfollowed successfully");
});

router.get("/:userId/posts", async (req, res) => {
  const { userId } = req.params as { userId: string };
  const { page, limit, skip } = parsePagination(req.query);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { likes: true, comments: true, saves: true } },
      },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: { authorId: userId },
    }),
  ]);

  ResponseHelper.successWithPagination(
    res,
    posts,
    { page, limit, total },
    "User posts retrieved successfully"
  );
});

export default router;
