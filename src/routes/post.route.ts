import { Router } from "express";
import { createPost, deletePost, getPost, getPosts } from "../controllers/post.controller";
import { validateCreatePost } from "../middleware/validation";
import { upload } from "../middleware/upload";
import { authenticateToken } from "../middleware/auth";

const route: Router = Router();

// get posts
route.get('/', getPosts);

// get post by id
route.get('/:id', getPost);

// create post (with file upload support) - requires authentication
route.post('/', authenticateToken, upload.single('image'), validateCreatePost, createPost);

// delete post - requires authentication
route.delete('/:id', authenticateToken, deletePost);

export default route;