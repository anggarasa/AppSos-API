"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "1mb" }));
app.use((0, morgan_1.default)("dev"));
app.use("/api", routes_1.default);
app.use((err, _req, res, _next) => {
    // Basic error handler
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ error: message });
});
app.listen(env_1.env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${env_1.env.port}`);
});
//# sourceMappingURL=index.js.map