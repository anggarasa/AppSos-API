import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { validateCreateUser, validateLogin } from "../middleware/validation";

const router: Router = Router();

// Register user
router.post('/register', validateCreateUser, register);

// Login user
router.post('/login', validateLogin, login);

// Logout user
router.post('/logout', logout);

export default router;
