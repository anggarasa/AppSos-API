"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', user_controller_1.getUsers);
router.get('/:id', user_controller_1.findUser);
router.put('/:id', auth_1.authenticateToken, upload_1.upload.single('avatar'), validation_1.validateUpdateUser, user_controller_1.updateUser);
router.delete('/:id', auth_1.authenticateToken, user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map