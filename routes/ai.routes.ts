import { Router } from 'express';
import { generateAnalysis } from '../controllers/ai.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.post('/generate', generateAnalysis);

export default router;