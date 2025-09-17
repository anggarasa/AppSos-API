import { Router } from "express";
import { savePost, unSave } from "../controllers/save.controller";
import { validateCreateSave, validateUnSavePost } from "../middleware/validation";

const route: Router = Router();

route.post('/', validateCreateSave, savePost);

route.delete('/unsave', validateUnSavePost, unSave);

export default route;