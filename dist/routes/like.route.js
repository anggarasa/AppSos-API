"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const like_controller_1 = require("../controllers/like.controller");
const auth_1 = require("../middleware/auth");
const route = (0, express_1.Router)();
route.post('/', auth_1.authenticateToken, validation_1.validateCreateLike, like_controller_1.createLike);
route.delete('/unlike', auth_1.authenticateToken, validation_1.validateUnlikePost, like_controller_1.unlikePost);
route.delete('/:id', auth_1.authenticateToken, like_controller_1.deleteLike);
route.get('/user/:userId/posts', like_controller_1.getLikedPostsByUser);
route.get('/user/:userId', like_controller_1.getLikesByUser);
route.get('/:id', like_controller_1.getLike);
route.get('/count/:postId', like_controller_1.getPostLikeCount);
route.get('/check/:userId/:postId', like_controller_1.checkUserLike);
exports.default = route;
//# sourceMappingURL=like.route.js.map