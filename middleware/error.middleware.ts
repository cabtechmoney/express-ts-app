import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

type ErrorLike = Error & {
  statusCode?: number;
  status?: string;
  code?: string;
  isOperational?: boolean;
};

// Centralized error handling middleware
export const errorMiddleware = (err: ErrorLike, req: Request, res: Response, _next: NextFunction) => {
  void _next;
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message; // Ensure message is copied

    // Handle specific error types
    if (error.code === 'P2025') { // Prisma record not found error
      error = new AppError('Resource not found.', 404);
    }
    // Add other specific error handlers here (e.g., validation errors, JWT errors)

    sendErrorProd(error, res);
  }
};

const sendErrorDev = (err: ErrorLike, res: Response) => {
  console.error('ERROR 💥', err);
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: ErrorLike, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({ status: err.status, message: err.message });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({ status: 'error', message: 'Something went very wrong!' });
  }
};
