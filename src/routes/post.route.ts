import { Router } from "express";
import { createPost, deletePost, getPost, getPosts } from "../controllers/post.controller";
import { validateCreatePost } from "../middleware/validation";
import { upload } from "../middleware/upload";

const route: Router = Router();

// get posts
route.get('/', getPosts);

// get post by id
route.get('/:id', getPost);

// create post (with file upload support)
route.post('/', upload.single('image'), validateCreatePost, createPost);

// delete post
route.delete('/:id', deletePost);

export default route;