import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import AppError from '../utils/appError';
import getSupabase from '../lib/supabase';

const table = 'projects';

export const getProjects = asyncHandler(async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) return res.status(503).json({ message: 'Database is not configured.' });

  const { data, error } = await supabase.from(table).select('*, client:clients(*)');
  if (error) throw error;
  return res.status(200).json(data ?? []);
});

export const getProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const supabase = getSupabase();
  if (!supabase) return next(new AppError('Database not configured', 503));

  const id = String(req.params.id);
  const { data, error } = await supabase.from(table).select('*, client:clients(*)').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return next(new AppError('Project not found', 404));
    throw error;
  }
  res.status(200).json(data);
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) return res.status(503).json({ message: 'Database not configured' });

  const { data, error } = await supabase.from(table).insert(req.body).select().single();
  if (error) throw error;
  res.status(201).json(data);
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) return res.status(503).json({ message: 'Database not configured' });

  const id = String(req.params.id);
  const { data, error } = await supabase.from(table).update(req.body).eq('id', id).select().single();
  if (error) throw error;
  res.status(200).json(data);
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) return res.status(503).json({ message: 'Database not configured' });

  const id = String(req.params.id);
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  res.status(204).send();
});
