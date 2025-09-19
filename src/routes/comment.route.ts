import { Router } from "express";
import { createComment, deleteComment, getCommentsByPost, getCommentsByUser, getComment, updateComment } from "../controllers/comment.controller";
import { validateCreateComment, validateUpdateComment } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const route: Router = Router();

// Get comments by post
route.get('/post/:postId', getCommentsByPost);

// Get comments by user
route.get('/user/:userId', getCommentsByUser);

// Get comment by id
route.get('/:id', getComment);

// Create comment - requires authentication
route.post('/', authenticateToken, validateCreateComment, createComment);

// Update comment - requires authentication
route.put('/:id', authenticateToken, validateUpdateComment, updateComment);

// Delete comment - requires authentication
route.delete('/:id', authenticateToken, deleteComment);

export default route;