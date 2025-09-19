import { Router } from "express";
import { createComment, deleteComment } from "../controllers/comment.controller";
import { validateCreateComment } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const route: Router = Router();

// Create comment - requires authentication
route.post('/', authenticateToken, validateCreateComment, createComment);

// Delete comment - requires authentication
route.delete('/:id', authenticateToken, deleteComment);

export default route;