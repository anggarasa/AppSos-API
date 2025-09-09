"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = __importDefault(require("../modules/auth/routes"));
const routes_2 = __importDefault(require("../modules/users/routes"));
const routes_3 = __importDefault(require("../modules/posts/routes"));
const routes_4 = __importDefault(require("../modules/likes/routes"));
const routes_5 = __importDefault(require("../modules/comments/routes"));
const routes_6 = __importDefault(require("../modules/saves/routes"));
const routes_7 = __importDefault(require("../modules/notifications/routes"));
const routes_8 = __importDefault(require("../modules/search/routes"));
const router = (0, express_1.Router)();
router.get("/health", (_req, res) => {
    res.json({ ok: true });
});
exports.default = router;
// mount modules
router.use("/auth", routes_1.default);
router.use("/users", routes_2.default);
router.use("/posts", routes_3.default);
router.use("/likes", routes_4.default);
router.use("/comments", routes_5.default);
router.use("/saves", routes_6.default);
router.use("/notifications", routes_7.default);
router.use("/search", routes_8.default);
//# sourceMappingURL=index.js.map