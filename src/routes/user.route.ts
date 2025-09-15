import { Router } from "express";
import { 
  getUsers, 
  findUser, 
  updateUser, 
  deleteUser 
} from "../controllers/user.controller";
import { validateUpdateUser } from "../middleware/validation";
import { upload } from "../middleware/upload";

const router: Router = Router();

// get users
router.get('/', getUsers);

// get user by username
router.get('/:id', findUser);

// update user (supports avatar upload via multipart/form-data)
router.put('/:id', upload.single('avatar'), validateUpdateUser, updateUser);

// delete user
router.delete('/:id', deleteUser);

export default router;