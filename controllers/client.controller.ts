import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler";
import AppError from "../utils/appError";
import getSupabase from "../lib/supabase";

const table = "clients";

const requireSupabase = () => {
  const supabase = getSupabase();
  if (!supabase) throw new AppError('Database is not configured.', 503);
  return supabase;
};

export const getClients = asyncHandler(async (_req: Request, res: Response) => {
  const { data, error } = await requireSupabase().from(table).select('*, projects(*)');
  if (error) throw error;
  return res.status(200).json(data ?? []);
});

export const getClient = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = String(req.params.id);
  const { data, error } = await requireSupabase().from(table).select('*, projects(*)').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('Client not found.', 404));
    }
    throw error;
  }

  res.status(200).json(data);
});

export const createClient = asyncHandler(async (req: Request, res: Response) => {
  const { data, error } = await requireSupabase().from(table).insert(req.body).select().single();

  if (error) throw error;

  res.status(201).json(data);
});

export const updateClient = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { data, error } = await requireSupabase().from(table).update(req.body).eq("id", id).select().single();

  if (error) throw error;

  res.status(200).json(data);
});

export const deleteClient = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { error } = await requireSupabase().from(table).delete().eq("id", id);

  if (error) throw error;

  res.status(204).send();
});
