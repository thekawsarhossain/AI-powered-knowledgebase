import { Request, Response } from 'express';
import { ArticleService } from '../services/article.service';
import {
  CreateArticleInput,
  UpdateArticleInput,
  GetArticlesQuery,
} from '../schemas/article.schema';
import { AuthenticatedRequest } from '../../../middleware/auth';

export class ArticleController {
  private articleService: ArticleService;

  constructor(articleService?: ArticleService) {
    this.articleService = articleService || new ArticleService();
  }

  createArticle = async (
    req: AuthenticatedRequest<{}, {}, CreateArticleInput>,
    res: Response
  ): Promise<void> => {
    try {
      const article = await this.articleService.createArticle(
        req.body,
        req.user!.userId
      );

      res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: article,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create article',
      });
    }
  };

  getArticles = async (
    req: AuthenticatedRequest<{}, {}, {}, GetArticlesQuery>,
    res: Response
  ): Promise<void> => {
    try {
      const filters = {
        search: req.query.search,
        tags:
          typeof req.query.tags === 'string'
            ? req.query.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : undefined,
        page: req.query.page ? parseInt(req.query.page) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      };

      const result = await this.articleService.getArticlesByAuthor(
        req.user!.userId,
        filters
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch articles',
      });
    }
  };

  getArticle = async (
    req: AuthenticatedRequest<{ id: string }>,
    res: Response
  ): Promise<void> => {
    try {
      const article = await this.articleService.getArticleById(
        req.params.id,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        data: article,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch article',
      });
    }
  };

  updateArticle = async (
    req: AuthenticatedRequest<{ id: string }, {}, UpdateArticleInput>,
    res: Response
  ): Promise<void> => {
    try {
      const article = await this.articleService.updateArticle(
        req.params.id,
        req.body,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        data: article,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update article',
      });
    }
  };

  deleteArticle = async (
    req: AuthenticatedRequest<{ id: string }>,
    res: Response
  ): Promise<void> => {
    try {
      await this.articleService.deleteArticle(req.params.id, req.user!.userId);

      res.status(200).json({
        success: true,
        message: 'Article deleted successfully',
      });
    } catch (error: any) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete article',
      });
    }
  };
}
