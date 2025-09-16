"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "Okee",
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});
app.get('/api/v1', (req, res) => {
    res.json({ message: "API v1 is working" });
});
app.use('/api/v1/auth', auth_route_1.default);
app.use('/api/v1/users', user_route_1.default);
app.use('/api/v1/posts', post_route_1.default);
app.use(errorHandler_1.errorHandler);
app.use(notFound_1.notFound);
exports.default = app;
//# sourceMappingURL=app.js.map