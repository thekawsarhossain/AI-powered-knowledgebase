import { apiClient, handleApiError } from '@/lib/client-api';
import {
    Article,
    ApiResponse,
    PaginatedResponse,
    CreateArticleRequest,
    UpdateArticleRequest,
    GetArticlesParams
} from '@/types';

export class ArticleService {
    async createArticle(data: CreateArticleRequest): Promise<Article> {
        try {
            const response = await apiClient.post<ApiResponse<Article>>('/articles', data);
            return response.data.data!;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async getArticles(params: GetArticlesParams = {}): Promise<PaginatedResponse<Article>> {
        try {
            const queryParams = {
                ...params,
                tags: Array.isArray(params.tags) ? params.tags.join(',') : params.tags
            };

            const response = await apiClient.get<ApiResponse<PaginatedResponse<Article>>>(
                '/articles',
                { params: queryParams }
            );
            return response.data.data!;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async getArticle(id: string): Promise<Article> {
        try {
            const response = await apiClient.get<ApiResponse<Article>>(`/articles/${id}`);
            return response.data.data!;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async updateArticle(id: string, data: UpdateArticleRequest): Promise<Article> {
        try {
            const response = await apiClient.put<ApiResponse<Article>>(`/articles/${id}`, data);
            return response.data.data!;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async deleteArticle(id: string): Promise<void> {
        try {
            await apiClient.delete(`/articles/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async summarizeArticle(id: string): Promise<string> {
        try {
            const response = await apiClient.post<ApiResponse<{ summary: string }>>(
                `/ai/summarize/${id}`
            );
            return response.data.data!.summary;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const articleService = new ArticleService();
