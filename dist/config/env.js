"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.string().default("4000"),
    JWT_SECRET: zod_1.z.string().min(10, "JWT_SECRET too short"),
    DATABASE_URL: zod_1.z.string().url(),
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
}
exports.env = {
    nodeEnv: parsed.data.NODE_ENV,
    port: Number(parsed.data.PORT),
    jwtSecret: parsed.data.JWT_SECRET,
    databaseUrl: parsed.data.DATABASE_URL,
};
//# sourceMappingURL=env.js.map