import { Router } from "express";
import { createPost, deletePost, getPost, getPosts, updatePost, getPostsByUser, getSavedPostsByUser } from "../controllers/post.controller";
import { validateCreatePost, validateUpdatePost } from "../middleware/validation";
import { upload } from "../middleware/upload";
import { authenticateToken } from "../middleware/auth";

const route: Router = Router();

// get posts
route.get('/', getPosts);

// get post by id
route.get('/:id', getPost);

// get posts by user
route.get('/user/:userId', getPostsByUser);

// get saved posts by user - requires authentication
route.get('/saved/:userId', authenticateToken, getSavedPostsByUser);

// create post (with file upload support) - requires authentication
route.post('/', authenticateToken, upload.single('image'), validateCreatePost, createPost);

// update post (with file upload support) - requires authentication
route.put('/:id', authenticateToken, upload.single('image'), validateUpdatePost, updatePost);

// delete post - requires authentication
route.delete('/:id', authenticateToken, deletePost);

export default route;