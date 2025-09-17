// routes file - IMPROVED VERSION
import { Router } from "express";
import { validateCreateLike, validateUnlikePost } from "../middleware/validation";
import { 
    createLike, 
    deleteLike,
    unlikePost,
    getPostLikeCount,
    checkUserLike
} from "../controllers/like.controller";

const route: Router = Router();

// Create a like
route.post('/', validateCreateLike, createLike);

// Unlike by userId and postId (more practical for frontend)
route.delete('/unlike', validateUnlikePost, unlikePost);

// Delete like by ID (keep for admin purposes)
route.delete('/:id', deleteLike);

// Get like count for a specific post
route.get('/count/:postId', getPostLikeCount);

// Check if user has liked a post
route.get('/check/:userId/:postId', checkUserLike);

export default route;