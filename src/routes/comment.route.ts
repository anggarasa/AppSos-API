import { Router } from "express";
import { createComment, deleteComment } from "../controllers/comment.controller";
import { validateCreateComment } from "../middleware/validation";

const route: Router = Router();

route.post('/', validateCreateComment, createComment);

route.delete('/:id', deleteComment);

export default route;