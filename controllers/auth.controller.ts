import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";
import asyncHandler from "../middleware/asyncHandler";
import getSupabase from "../lib/supabase";

const omitPassword = <T extends { password?: string }>({ password: _password, ...user }: T) => {
  void _password;
  return user;
};

export const login = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const { data: user, error } = await getSupabase().from("users").select("*").eq("email", email).maybeSingle();

  if (error) throw error;
  if (!user) {
    return next(new AppError("Invalid credentials.", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password as string);

  if (!isMatch) {
    return next(new AppError("Invalid credentials.", 401));
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

  const userWithoutPassword = omitPassword(user);
  res.status(200).json({ token, user: userWithoutPassword });
});

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  const { data: existingUser, error: existingError } = await getSupabase().from("users").select("id").eq("email", email).maybeSingle();

  if (existingError) throw existingError;
  if (existingUser) {
    return next(new AppError("User already exists.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: user, error } = await getSupabase().from("users").insert({ name, email, password: hashedPassword }).select().single();

  if (error) throw error;

  const userWithoutPassword = omitPassword(user);
  res.status(201).json(userWithoutPassword);
});
