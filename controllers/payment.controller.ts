import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import AppError from '../utils/appError';
import getSupabase from '../lib/supabase';

const table = 'payments';

export const getPayments = asyncHandler(async (_req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) throw new AppError('Database is not configured.', 503);

  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  res.status(200).json(data ?? []);
});

export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) return res.status(503).json({ message: 'Database not configured' });

  const { data, error } = await supabase.from(table).insert(req.body).select().single();
  if (error) throw error;
  res.status(201).json(data);
});

export const updatePayment = asyncHandler(async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) return res.status(503).json({ message: 'Database not configured' });

  const id = String(req.params.id);
  const { data, error } = await supabase.from(table).update(req.body).eq('id', id).select().single();
  if (error) throw error;
  res.status(200).json(data);
});

export const deletePayment = asyncHandler(async (req: Request, res: Response) => {
  const supabase = getSupabase();
  if (!supabase) return res.status(503).json({ message: 'Database not configured' });

  const id = String(req.params.id);
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  res.status(204).send();
});
