import { prisma } from '../../../config/database';
import { Article, CreateArticleData, UpdateArticleData, ArticleFilters, PaginatedArticles } from '../types/article.types';

export interface IArticleRepository {
    create(data: CreateArticleData, authorId: string): Promise<Article>;
    findById(id: string, authorId?: string): Promise<Article | null>;
    findByAuthorId(authorId: string, filters: ArticleFilters): Promise<PaginatedArticles>;
    update(id: string, data: UpdateArticleData, authorId: string): Promise<boolean>;
    delete(id: string, authorId: string): Promise<boolean>;
    updateSummary(id: string, summary: string): Promise<void>;
}

export class ArticleRepository implements IArticleRepository {
    async create(data: CreateArticleData, authorId: string): Promise<Article> {
        return await prisma.article.create({
            data: {
                title: data.title,
                body: data.body,
                tags: data.tags || [],
                authorId
            },
            include: {
                author: {
                    select: { id: true, email: true }
                }
            }
        });
    }

    async findById(id: string, authorId?: string): Promise<Article | null> {
        const where: any = { id };
        if (authorId) {
            where.authorId = authorId;
        }

        return await prisma.article.findFirst({
            where,
            include: {
                author: {
                    select: { id: true, email: true }
                }
            }
        });
    }

    async findByAuthorId(authorId: string, filters: ArticleFilters): Promise<PaginatedArticles> {
        const { search, tags, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;

        const where: any = { authorId };

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { body: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (tags && tags.length > 0) {
            where.tags = { hasSome: tags };
        }

        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: { id: true, email: true }
                    }
                }
            }),
            prisma.article.count({ where })
        ]);

        return {
            articles,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async update(id: string, data: UpdateArticleData, authorId: string): Promise<boolean> {
        const result = await prisma.article.updateMany({
            where: { id, authorId },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.body && { body: data.body }),
                ...(data.tags !== undefined && { tags: data.tags })
            }
        });

        return result.count > 0;
    }

    async delete(id: string, authorId: string): Promise<boolean> {
        const result = await prisma.article.deleteMany({
            where: { id, authorId }
        });

        return result.count > 0;
    }

    async updateSummary(id: string, summary: string): Promise<void> {
        await prisma.article.update({
            where: { id },
            data: { summary }
        });
    }
}
