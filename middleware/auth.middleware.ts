import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return next(new AppError("No token provided.", 401));
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: string;
    };

    req.user = decoded;

    next();
  } catch {
    return next(new AppError("Invalid token.", 401));
  }
};
