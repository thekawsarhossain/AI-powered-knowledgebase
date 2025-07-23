import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticateToken } from '../../../middleware/auth';
import { validate } from '../../../middleware/validation';
import { z } from 'zod';

const router = Router();
const aiController = new AIController();

const summarizeArticleSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid article ID'),
  }),
});

router.use(authenticateToken);
router.post(
  '/summarize/:id',
  validate(summarizeArticleSchema),
  aiController.summarizeArticle
);

export default router;
