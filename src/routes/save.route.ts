import { Router } from "express";
import { savePost, unSave, getSavedPostsByUser, checkUserSave, getPostSaveCount, getSave } from "../controllers/save.controller";
import { validateCreateSave, validateUnSavePost } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const route: Router = Router();

// Get saved posts by user - requires authentication
route.get('/user/:userId', authenticateToken, getSavedPostsByUser);

// Check if user has saved a post
route.get('/check/:userId/:postId', checkUserSave);

// Get save count for a post
route.get('/count/:postId', getPostSaveCount);

// Get save by id
route.get('/:id', getSave);

// Save post - requires authentication
route.post('/', authenticateToken, validateCreateSave, savePost);

// Unsave post - requires authentication
route.delete('/unsave', authenticateToken, validateUnSavePost, unSave);

export default route;