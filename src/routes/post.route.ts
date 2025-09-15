import { Router } from "express";
import { createPost, deletePost, getPost, getPosts } from "../controllers/post.controller";

const route: Router = Router();

// get posts
route.get('/', getPosts);

// get post by id
route.get('/:id', getPost);

// create post
route.post('/', createPost);

// delete post
route.delete('/:id', deletePost);

export default route;