import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  name: z.string().min(1),
  password: z.string().min(6),
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { email, username, name, password } = parsed.data;
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing)
    return res.status(409).json({ error: "Email or username already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, username, name, passwordHash },
  });
  const token = jwt.sign({ userId: user.id }, env.jwtSecret, {
    expiresIn: "7d",
  });
  res.status(201).json({ token, user: { id: user.id, email, username, name } });
});

const loginSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string().min(6),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { emailOrUsername, password } = parsed.data;
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] },
  });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user.id }, env.jwtSecret, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
    },
  });
});

export default router;
