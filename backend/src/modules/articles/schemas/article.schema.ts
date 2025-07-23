import { z } from 'zod';

export const createArticleSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
        body: z.string().min(1, 'Content is required'),
        tags: z.array(z.string()).optional().default([])
    })
});

export const updateArticleSchema = z.object({
    params: z.object({
        id: z.string().cuid('Invalid article ID')
    }),
    body: z.object({
        title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
        body: z.string().min(1, 'Content is required').optional(),
        tags: z.array(z.string()).optional()
    })
});

export const getArticlesSchema = z.object({
    query: z.object({
        search: z.string().optional(),
        tags: z.string().optional(),
        page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
        limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional()
    })
});

export const getArticleSchema = z.object({
    params: z.object({
        id: z.string().cuid('Invalid article ID')
    })
});

export const deleteArticleSchema = z.object({
    params: z.object({
        id: z.string().cuid('Invalid article ID')
    })
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>['body'];
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>['body'];
export type GetArticlesQuery = z.infer<typeof getArticlesSchema>['query'];
