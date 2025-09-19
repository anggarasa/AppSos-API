import { Router } from "express";
import { register, login, logout, refresh } from "../controllers/auth.controller";
import { validateCreateUser, validateLogin } from "../middleware/validation";

const router: Router = Router();

// Register user
router.post('/register', validateCreateUser, register);

// Login user
router.post('/login', validateLogin, login);

// Refresh access token
router.post('/refresh', refresh);

// Logout user
router.post('/logout', logout);

export default router;
