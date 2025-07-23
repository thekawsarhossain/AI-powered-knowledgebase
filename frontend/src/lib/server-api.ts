import { cookies } from 'next/headers';
import {
    Article,
    ApiResponse,
    PaginatedResponse,
    GetArticlesParams
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ServerApiClient {
    private async getAuthToken(): Promise<string | null> {
        try {
            const cookieStore = await cookies();
            return cookieStore.get('auth_token')?.value || null;
        } catch {
            return null;
        }
    }

    private async fetchApi<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = await this.getAuthToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
            ...options,
            headers,
            cache: 'no-store',
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            if (response.status === 429) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const retryResponse = await fetch(`${API_BASE_URL}/api${endpoint}`, {
                    ...options,
                    headers,
                    cache: 'no-store',
                });

                if (!retryResponse.ok) {
                    throw new Error(`API call failed: ${retryResponse.status} - ${retryResponse.statusText}`);
                }
                return retryResponse.json();
            }

            if (response.status === 403) {
                throw new Error('Authentication failed. Please login again.');
            }

            throw new Error(`API call failed: ${response.status} - ${response.statusText}`);
        }

        return response.json();
    }

    async getArticles(params: GetArticlesParams = {}): Promise<PaginatedResponse<Article>> {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append('search', params.search);
        if (params.tags) queryParams.append('tags', params.tags);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const query = queryParams.toString();
        const endpoint = `/articles${query ? `?${query}` : ''}`;

        const response = await this.fetchApi<ApiResponse<PaginatedResponse<Article>>>(endpoint);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to fetch articles');
        }

        return response.data;
    }

    async getArticle(id: string): Promise<Article> {
        const response = await this.fetchApi<ApiResponse<Article>>(`/articles/${id}`);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Article not found');
        }

        return response.data;
    }

    async validateAuth(): Promise<boolean> {
        try {
            const token = await this.getAuthToken();
            if (!token) return false;

            const response = await this.fetchApi<ApiResponse<unknown>>('/auth/validate', { method: 'POST' });
            return response.success;
        } catch {
            return false;
        }
    }
}

export const serverApiClient = new ServerApiClient();
