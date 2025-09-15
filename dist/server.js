"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
const prisma = new prisma_1.PrismaClient();
async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
    }
    catch (e) {
        console.error('Failed connect to database: ', e);
        process.exit(1);
    }
}
async function startServer() {
    try {
        await connectDatabase();
        const server = app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Environment:', process.env.NODE_ENV || 'development');
        });
        process.on('SIGTERM', async () => {
            console.log('SIGTERM signal received: closing HTTP server');
            server.close(async () => {
                await prisma.$disconnect();
                console.log('HTTP server closed');
                process.exit(0);
            });
        });
        process.on('SIGINT', async () => {
            console.log('SIGINT signal received: closing HTTP server');
            server.close(async () => {
                await prisma.$disconnect();
                console.log('HTTP server closed');
                process.exit(0);
            });
        });
    }
    catch (e) {
        console.log('Error starting server: ', e);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map