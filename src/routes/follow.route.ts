import { Router } from "express";
import { 
    follow, 
    unfollow, 
    getFollowersList, 
    getFollowingList, 
    getFollowStatistics 
} from "../controllers/follow.controller";
import { validateFollowUser, validateUnfollowUser } from "../middleware/validation";

const route: Router = Router();

// Follow a user
route.post('/', validateFollowUser, follow);

// Unfollow a user
route.delete('/unfollow', validateUnfollowUser, unfollow);

// Get followers list for a user
route.get('/followers/:userId', getFollowersList);

// Get following list for a user
route.get('/following/:userId', getFollowingList);

// Get follow statistics (followers count, following count)
route.get('/stats/:userId', getFollowStatistics);

export default route;
