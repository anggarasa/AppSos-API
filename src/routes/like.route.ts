// routes file - IMPROVED VERSION
import { Router } from "express";
import { validateCreateLike, validateUnlikePost } from "../middleware/validation";
import { 
    createLike, 
    deleteLike,
    unlikePost,
    getPostLikeCount,
    checkUserLike,
    getLikedPostsByUser,
    getLikesByUser,
    getLike
} from "../controllers/like.controller";
import { authenticateToken } from "../middleware/auth";

const route: Router = Router();

// Create a like - requires authentication
route.post('/', authenticateToken, validateCreateLike, createLike);

// Unlike by userId and postId (more practical for frontend) - requires authentication
route.delete('/unlike', authenticateToken, validateUnlikePost, unlikePost);

// Delete like by ID (keep for admin purposes) - requires authentication
route.delete('/:id', authenticateToken, deleteLike);

// Get liked posts by user
route.get('/user/:userId/posts', getLikedPostsByUser);

// Get likes by user
route.get('/user/:userId', getLikesByUser);

// Get like by id
route.get('/:id', getLike);

// Get like count for a specific post
route.get('/count/:postId', getPostLikeCount);

// Check if user has liked a post
route.get('/check/:userId/:postId', checkUserLike);

export default route;