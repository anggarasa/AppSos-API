import { Router } from "express";
import { 
  getUsers, 
  findUser, 
  updateUser, 
  deleteUser,
  getUserProfileWithStats,
  getUserByUsername,
  searchUsersList,
  getUserActivityFeed
} from "../controllers/user.controller";
import { validateUpdateUser } from "../middleware/validation";
import { upload } from "../middleware/upload";
import { authenticateToken } from "../middleware/auth";

const router: Router = Router();

// get users
router.get('/', getUsers);

// search users
router.get('/search', searchUsersList);

// get user by username
router.get('/username/:username', getUserByUsername);

// get user profile with stats
router.get('/profile/:id', getUserProfileWithStats);

// get user activity feed
router.get('/activity/:userId', getUserActivityFeed);

// get user by id
router.get('/:id', findUser);

// update user (supports avatar upload via multipart/form-data) - requires authentication
router.put('/:id', authenticateToken, upload.single('avatar'), validateUpdateUser, updateUser);

// delete user - requires authentication
router.delete('/:id', authenticateToken, deleteUser);

export default router;