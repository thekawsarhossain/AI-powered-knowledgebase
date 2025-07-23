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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleData {
  title: string;
  body: string;
  tags?: string[];
}

export interface UpdateArticleData {
  title?: string;
  body?: string;
  tags?: string[];
}

export interface ArticleFilters {
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface PaginatedArticles {
  articles: Article[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
