import { PrismaClient } from "@prisma/client";
import app from "./app";

const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

// fungsi untuk konek ke database
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (e) {
    console.error('Failed connect to database: ', e);
    process.exit(1);
  }
}

// fungsi untuk menjalankan server
async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Environment:', process.env.NODE_ENV || 'development');
    });

    // shutdown gracefully
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
  } catch (e) {
    console.log('Error starting server: ', e);
    process.exit(1);
  }
}

startServer();