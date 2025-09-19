import { Router } from "express";
import { 
    follow, 
    unfollow, 
    getFollowersList, 
    getFollowingList, 
    getFollowStatistics,
    checkFollowStatus,
    getMutualFollowsList,
    getFollow,
    getFollowSuggestionsList
} from "../controllers/follow.controller";
import { validateFollowUser, validateUnfollowUser } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const route: Router = Router();

// Follow a user - requires authentication
route.post('/', authenticateToken, validateFollowUser, follow);

// Unfollow a user - requires authentication
route.delete('/unfollow', authenticateToken, validateUnfollowUser, unfollow);

// Get followers list for a user
route.get('/followers/:userId', getFollowersList);

// Get following list for a user
route.get('/following/:userId', getFollowingList);

// Get follow statistics (followers count, following count)
route.get('/stats/:userId', getFollowStatistics);

// Check if user is following another user
route.get('/check/:followerId/:followingId', checkFollowStatus);

// Get mutual follows between two users
route.get('/mutual/:userId1/:userId2', getMutualFollowsList);

// Get follow suggestions for a user
route.get('/suggestions/:userId', getFollowSuggestionsList);

// Get follow by id
route.get('/:id', getFollow);

export default route;
