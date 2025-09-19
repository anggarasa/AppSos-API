"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const route = (0, express_1.Router)();
route.post('/', auth_1.authenticateToken, validation_1.validateCreateComment, comment_controller_1.createComment);
route.delete('/:id', auth_1.authenticateToken, comment_controller_1.deleteComment);
exports.default = route;
//# sourceMappingURL=comment.route.js.map