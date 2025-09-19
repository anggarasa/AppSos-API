import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/tokenUtils';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
      };
    }
  }
}

// Middleware to verify JWT token
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers['authorization']);

    if (!token) {
      res.status(401).json({
        status: 401,
        message: 'Access token required'
      });
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      res.status(401).json({
        status: 401,
        message: 'Invalid or expired token'
      });
      return;
    }
    
    // Get user from database to ensure user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true
      }
    });

    if (!user) {
      res.status(401).json({
        status: 401,
        message: 'User not found'
      });
      return;
    }

    // Add user info to request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers['authorization']);

    if (!token) {
      next(); // Continue without user info
      return;
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      next(); // Continue without user info
      return;
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true
      }
    });

    if (user) {
      req.user = {
        id: user.id,
        username: user.username,
        email: user.email
      };
    }

    next();
  } catch (error) {
    // If token is invalid, continue without user info
    next();
  }
};
