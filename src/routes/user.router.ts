import { Router } from "express";
import { getUsers } from "../controllers/user.controller";

const router: Router = Router();

// get users
router.get('/', getUsers);

// get user by username
router.get('/:username', getUsers);

// create user
router.post('/', getUsers);

// update user
router.put('/:id', getUsers);

// delete user
router.delete('/:id', getUsers);

export default router;