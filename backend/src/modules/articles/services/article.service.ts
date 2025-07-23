import { IArticleRepository, ArticleRepository } from '../repositories/article.repository';
import { Article, CreateArticleData, UpdateArticleData, ArticleFilters, PaginatedArticles } from '../types/article.types';

export class ArticleService {
    private articleRepository: IArticleRepository;

    constructor(articleRepository?: IArticleRepository) {
        this.articleRepository = articleRepository || new ArticleRepository();
    }

    async createArticle(data: CreateArticleData, authorId: string): Promise<Article> {
        const sanitizedData = {
            ...data,
            tags: data.tags ? data.tags.filter(tag => tag.trim().length > 0) : []
        };

        return await this.articleRepository.create(sanitizedData, authorId);
    }

    async getArticleById(id: string, authorId: string): Promise<Article> {
        const article = await this.articleRepository.findById(id, authorId);

        if (!article) {
            throw new Error('Article not found or you do not have permission to access it');
        }

        return article;
    }

    async getArticlesByAuthor(authorId: string, filters: ArticleFilters): Promise<PaginatedArticles> {
        if (filters.tags && typeof filters.tags === 'string') {
            filters.tags = (filters.tags as string)?.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        filters.page = Math.max(1, filters.page || 1);
        filters.limit = Math.min(50, Math.max(1, filters.limit || 10));

        return await this.articleRepository.findByAuthorId(authorId, filters);
    }

    async updateArticle(id: string, data: UpdateArticleData, authorId: string): Promise<Article> {
        if (data.tags) {
            data.tags = data.tags.filter(tag => tag.trim().length > 0);
        }

        const updated = await this.articleRepository.update(id, data, authorId);

        if (!updated) {
            throw new Error('Article not found or you do not have permission to update it');
        }

        return await this.getArticleById(id, authorId);
    }

    async deleteArticle(id: string, authorId: string): Promise<void> {
        const deleted = await this.articleRepository.delete(id, authorId);

        if (!deleted) {
            throw new Error('Article not found or you do not have permission to delete it');
        }
    }

    async updateArticleSummary(id: string, summary: string): Promise<void> {
        await this.articleRepository.updateSummary(id, summary);
    }
}
