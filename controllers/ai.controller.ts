import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { generateAiText } from '../utils/features/gemini';

export const generateAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const prompt = typeof req.body.prompt === 'string' ? req.body.prompt.trim() : '';
  const context = Array.isArray(req.body.context) ? req.body.context : [];

  if (!prompt || prompt.length > 1000) {
    return res.status(400).json({ message: 'Enter a question up to 1,000 characters.' });
  }

  const safeContext = JSON.stringify(context.slice(0, 100));
  const result = await generateAiText(
    `You are a concise CRM pipeline analyst. Answer using only the supplied CRM data. If the data does not support a conclusion, say so.\n\nCRM project data: ${safeContext}\n\nQuestion: ${prompt}`,
  );

  return res.status(result.success ? 200 : 503).json(result);
});