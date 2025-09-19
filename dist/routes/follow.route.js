"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follow_controller_1 = require("../controllers/follow.controller");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const route = (0, express_1.Router)();
route.post('/', auth_1.authenticateToken, validation_1.validateFollowUser, follow_controller_1.follow);
route.delete('/unfollow', auth_1.authenticateToken, validation_1.validateUnfollowUser, follow_controller_1.unfollow);
route.get('/followers/:userId', follow_controller_1.getFollowersList);
route.get('/following/:userId', follow_controller_1.getFollowingList);
route.get('/stats/:userId', follow_controller_1.getFollowStatistics);
exports.default = route;
//# sourceMappingURL=follow.route.js.map