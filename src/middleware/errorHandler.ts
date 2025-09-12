import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  // log error
  console.error(err);

  // prisma validation error
  if (err.name === 'PrismaClientValidationError') {
    const message = 'Invalid data input';
    error = { name: 'ValidationError', message, statusCode: 400 };
  }

  // prisma known request error
  if (err.name === 'PrismaClientKnownRequestError') {
    const message = 'Database operation failed';
    error = { name: 'DatabaseError', message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
}