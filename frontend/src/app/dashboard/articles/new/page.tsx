import { ArticleForm } from '@/components/articles/ArticleForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create New Article',
    description: 'Create a new article in your knowledge base',
};

export default function NewArticlePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <ArticleForm mode="create" />
        </div>
    );
}
