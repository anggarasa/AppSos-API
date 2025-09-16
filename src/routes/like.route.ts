import { Router } from "express";
import { validateCreateLike } from "../middleware/validation";
import { createLike, deleteLike } from "../controllers/like.controller";

const route: Router = Router();

route.post('/', validateCreateLike, createLike);

route.delete('/:id', deleteLike);

export default route;