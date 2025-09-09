import { Router } from "express";
import authRoutes from "../modules/auth/routes";
import usersRoutes from "../modules/users/routes";
import postsRoutes from "../modules/posts/routes";
import likesRoutes from "../modules/likes/routes";
import commentsRoutes from "../modules/comments/routes";
import savesRoutes from "../modules/saves/routes";
import notificationsRoutes from "../modules/notifications/routes";
import searchRoutes from "../modules/search/routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

export default router;

// mount modules
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);
router.use("/likes", likesRoutes);
router.use("/comments", commentsRoutes);
router.use("/saves", savesRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/search", searchRoutes);
