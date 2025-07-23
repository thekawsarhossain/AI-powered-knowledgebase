import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatDateTime } from '@/lib/utils';
import { serverApiClient } from '@/lib/server-api';
import { ArticleActions } from '@/components/articles/ArticleActions';
import { PageLoadingSpinner } from '@/components/layout/LoadingSpinner';
import type { Metadata } from 'next';

interface ArticlePageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    try {
        const { id } = await params;
        const article = await serverApiClient.getArticle(id);

        return {
            title: article.title,
            description: article.summary || `${article.body.substring(0, 160)}...`,
            keywords: article.tags.join(', '),
            openGraph: {
                title: article.title,
                description: article.summary || `${article.body.substring(0, 160)}...`,
                type: 'article',
                publishedTime: article.createdAt,
                modifiedTime: article.updatedAt,
                tags: article.tags,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Article Not Found',
            description: 'The requested article could not be found',
        };
    }
}

async function ArticleContent({ articleId }: { articleId: string }) {
    try {
        const article = await serverApiClient.getArticle(articleId);

        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Articles
                        </Button>
                    </Link>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {article.title}
                                </h1>

                                {article.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {article.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {article.author.email}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Created {formatDate(article.createdAt)}
                                    </div>
                                    {article.updatedAt !== article.createdAt && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            Updated {formatDate(article.updatedAt)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <ArticleActions
                                articleId={article.id}
                                currentSummary={article.summary}
                            />
                        </div>
                    </CardHeader>
                </Card>

                {article.summary && (
                    <Card className="mb-6 border-primary/20 bg-primary/5">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-semibold text-primary">AI Summary</h2>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">{article.summary}</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="pt-6">
                        <div className="prose max-w-none">
                            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
                                {article.body}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>
                        This article was created on {formatDateTime(article.createdAt)}
                        {article.updatedAt !== article.createdAt && (
                            <> and last updated on {formatDateTime(article.updatedAt)}</>
                        )}
                    </p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching article:', error);
        notFound();
    }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { id } = await params;

    return (
        <Suspense fallback={<PageLoadingSpinner />}>
            <ArticleContent articleId={id} />
        </Suspense>
    );
}