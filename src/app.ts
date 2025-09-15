import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import postRouter from './routes/post.route';

// load environment variables from .env file
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// cors configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// logging
app.use(morgan('combined'));

// body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: "Okee",
    message: "Server is running",
    timestamp: new Date().toISOString()
  })
});

// API routes
app.get('/api/v1', (req, res) => {
  res.json({ message: "API v1 is working" });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);

// error handling middleware
app.use(errorHandler);
app.use(notFound);


export default app;

