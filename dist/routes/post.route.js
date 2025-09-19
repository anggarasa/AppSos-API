"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const route = (0, express_1.Router)();
route.get('/', post_controller_1.getPosts);
route.get('/:id', post_controller_1.getPost);
route.post('/', auth_1.authenticateToken, upload_1.upload.single('image'), validation_1.validateCreatePost, post_controller_1.createPost);
route.delete('/:id', auth_1.authenticateToken, post_controller_1.deletePost);
exports.default = route;
//# sourceMappingURL=post.route.js.map