import { Router } from 'express';
import { ArticleController } from '../controllers/article.controller';
import { authenticateToken } from '../../../middleware/auth';
import { validate } from '../../../middleware/validation';
import {
  createArticleSchema,
  updateArticleSchema,
  getArticlesSchema,
  getArticleSchema,
  deleteArticleSchema,
} from '../schemas/article.schema';

const router = Router();
const articleController = new ArticleController();

router.use(authenticateToken);

router.post(
  '/',
  validate(createArticleSchema),
  articleController.createArticle
);
router.get('/', validate(getArticlesSchema), articleController.getArticles);
router.get('/:id', validate(getArticleSchema), articleController.getArticle);
router.put(
  '/:id',
  validate(updateArticleSchema),
  articleController.updateArticle
);
router.delete(
  '/:id',
  validate(deleteArticleSchema),
  articleController.deleteArticle
);

export default router;
