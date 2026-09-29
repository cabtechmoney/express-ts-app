import dotenv from 'dotenv';
import { generateAiText } from './features/gemini';

dotenv.config();

export async function generateInvoiceText(clientName: string, amount: number, items: string[]) {
  const prompt = `Generate a professional invoice summary for client ${clientName}, total amount ${amount}, items: ${items.join(', ')}. Keep it brief and professional.`;
  return generateAiContent(prompt);
}

export async function generateClientMessage(clientName: string, projectName: string) {
  const prompt = `Write a professional and friendly message to client ${clientName} about project ${projectName}. Keep it concise (2-3 sentences).`;
  return generateAiContent(prompt);
}

export async function generateProposal(projectScope: string, budget: number, timeline: string) {
  const prompt = `Generate a professional proposal for: Scope: ${projectScope}, Budget: $${budget}, Timeline: ${timeline}. Keep it under 150 words.`;
  return generateAiContent(prompt);
}

async function generateAiContent(prompt: string): Promise<string> {
  const result = await generateAiText(prompt);
  return result.success ? result.text : `[AI unavailable: ${result.message}]`;
}
