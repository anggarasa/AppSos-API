"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const save_controller_1 = require("../controllers/save.controller");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const route = (0, express_1.Router)();
route.get('/user/:userId', auth_1.authenticateToken, save_controller_1.getSavedPostsByUser);
route.get('/check/:userId/:postId', save_controller_1.checkUserSave);
route.get('/count/:postId', save_controller_1.getPostSaveCount);
route.get('/:id', save_controller_1.getSave);
route.post('/', auth_1.authenticateToken, validation_1.validateCreateSave, save_controller_1.savePost);
route.delete('/unsave', auth_1.authenticateToken, validation_1.validateUnSavePost, save_controller_1.unSave);
exports.default = route;
//# sourceMappingURL=save.route.js.map