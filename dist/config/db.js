"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const prisma = globalThis._prisma || new prisma_1.PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
if (process.env.NODE_ENV === "development")
    globalThis._prisma = prisma;
exports.default = prisma;
//# sourceMappingURL=db.js.map