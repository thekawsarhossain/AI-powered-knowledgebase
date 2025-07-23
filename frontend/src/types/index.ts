export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  tags: string[];
  summary?: string | null;
  authorId: string;
  author: {
    id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  articles: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateArticleRequest {
  title: string;
  body: string;
  tags?: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  body?: string;
  tags?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface GetArticlesParams {
  search?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

export interface ArticleSearchParams {
  search?: string;
  tags?: string;
  page?: string;
}

export interface ArticleSearchParamsAsync {
  search?: Promise<string>;
  tags?: Promise<string>;
  page?: Promise<string>;
}
