import { Router } from "express";
import { savePost, unSave } from "../controllers/save.controller";
import { validateCreateSave, validateUnSavePost } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const route: Router = Router();

// Save post - requires authentication
route.post('/', authenticateToken, validateCreateSave, savePost);

// Unsave post - requires authentication
route.delete('/unsave', authenticateToken, validateUnSavePost, unSave);

export default route;