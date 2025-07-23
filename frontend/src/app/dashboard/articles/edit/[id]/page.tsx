import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ArticleForm } from '@/components/articles/ArticleForm';
import { PageLoadingSpinner } from '@/components/layout/LoadingSpinner';
import { serverApiClient } from '@/lib/server-api';
import type { Metadata } from 'next';

interface EditArticlePageProps {
    params: Promise<{ id: string }>;
}


export async function generateMetadata({ params }: EditArticlePageProps): Promise<Metadata> {
    try {
        const { id } = await params;
        const article = await serverApiClient.getArticle(id);

        return {
            title: `Edit: ${article.title}`,
            description: `Edit the article: ${article.title}`,
        };
    } catch (error) {
        console.error('Error generating metadata for edit article page:', error);
        return {
            title: 'Edit Article',
            description: 'Edit an article in your knowledge base',
        };
    }
}

async function EditArticleForm({ articleId }: { articleId: string }) {
    try {
        const article = await serverApiClient.getArticle(articleId);

        return (
            <div className="max-w-4xl mx-auto">
                <ArticleForm mode="edit" initialData={article} />
            </div>
        );
    } catch (error) {
        console.error('Error fetching article for edit:', error);
        notFound();
    }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const { id } = await params;
    return (
        <Suspense fallback={<PageLoadingSpinner />}>
            <EditArticleForm articleId={id} />
        </Suspense>
    );
}
