import { ArticleService } from '../../../src/modules/articles/services/article.service';
import { ArticleRepository } from '../../../src/modules/articles/repositories/article.repository';

jest.mock('../../../src/modules/articles/repositories/article.repository');

describe('ArticleService', () => {
    let articleService: ArticleService;
    let mockArticleRepository: jest.Mocked<ArticleRepository>;

    beforeEach(() => {
        mockArticleRepository = new ArticleRepository() as jest.Mocked<ArticleRepository>;
        articleService = new ArticleService(mockArticleRepository);
    });

    describe('createArticle', () => {
        it('should create an article successfully', async () => {
            const articleData = {
                title: 'Test Article',
                body: 'Test content',
                tags: ['test', 'article']
            };
            const authorId = 'user123';

            const expectedArticle = {
                id: 'article123',
                ...articleData,
                authorId,
                author: { id: authorId, email: 'test@example.com' },
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockArticleRepository.create.mockResolvedValue(expectedArticle);

            const result = await articleService.createArticle(articleData, authorId);

            expect(mockArticleRepository.create).toHaveBeenCalledWith(articleData, authorId);
            expect(result).toEqual(expectedArticle);
        });

        it('should filter empty tags', async () => {
            const articleData = {
                title: 'Test Article',
                body: 'Test content',
                tags: ['test', '', '  ', 'article']
            };
            const authorId = 'user123';

            const expectedSanitizedData = {
                ...articleData,
                tags: ['test', 'article']
            };

            await articleService.createArticle(articleData, authorId);

            expect(mockArticleRepository.create).toHaveBeenCalledWith(expectedSanitizedData, authorId);
        });
    });

    describe('getArticleById', () => {
        it('should return article if found', async () => {
            const articleId = 'article123';
            const authorId = 'user123';
            const expectedArticle = {
                id: articleId,
                title: 'Test Article',
                body: 'Test content',
                tags: ['test'],
                authorId,
                author: { id: authorId, email: 'test@example.com' },
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockArticleRepository.findById.mockResolvedValue(expectedArticle);

            const result = await articleService.getArticleById(articleId, authorId);

            expect(mockArticleRepository.findById).toHaveBeenCalledWith(articleId, authorId);
            expect(result).toEqual(expectedArticle);
        });

        it('should throw error if article not found', async () => {
            const articleId = 'nonexistent';
            const authorId = 'user123';

            mockArticleRepository.findById.mockResolvedValue(null);

            await expect(articleService.getArticleById(articleId, authorId))
                .rejects.toThrow('Article not found or you do not have permission to access it');
        });
    });
});
