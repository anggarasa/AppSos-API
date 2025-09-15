import { Router } from "express";
import { 
  getUsers, 
  findUser, 
  createUser, 
  updateUser, 
  deleteUser 
} from "../controllers/user.controller";
import { validateCreateUser, validateUpdateUser } from "../middleware/validation";

const router: Router = Router();

// get users
router.get('/', getUsers);

// get user by username
router.get('/:id', findUser);

// create user
router.post('/', validateCreateUser, createUser);

// update user
router.put('/:id', validateUpdateUser, updateUser);

// delete user
router.delete('/:id', deleteUser);

export default router;