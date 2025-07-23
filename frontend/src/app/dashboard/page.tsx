import { Suspense } from 'react';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { SearchForm } from '@/components/articles/SearchForm';
import { Button } from '@/components/ui/button';
import { PageLoadingSpinner } from '@/components/layout/LoadingSpinner';
import { Plus, FileText, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { serverApiClient } from '@/lib/server-api';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    tags?: string;
    page?: string;
  }>;
}

async function ArticleList({
  searchParams
}: {
  searchParams: Promise<{
    search?: string;
    tags?: string;
    page?: string;
  }>
}) {
  try {
    // Await searchParams
    const resolvedSearchParams = await searchParams;

    const params = {
      search: resolvedSearchParams.search,
      tags: resolvedSearchParams.tags,
      page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1,
      limit: 12
    };

    const result = await serverApiClient.getArticles(params);

    if (result.articles.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No articles found</p>
          <p className="text-gray-500 mb-6">
            {resolvedSearchParams.search || resolvedSearchParams.tags
              ? "Try adjusting your search criteria or create a new article."
              : "Start building your knowledge base by creating your first article."
            }
          </p>
          <Link href="/dashboard/articles/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create your first article
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{result.pagination.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Page</p>
                <p className="text-2xl font-bold text-gray-900">{result.articles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pages</p>
                <p className="text-2xl font-bold text-gray-900">{result.pagination.pages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Page</p>
                <p className="text-2xl font-bold text-gray-900">{result.pagination.page}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {result.pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: result.pagination.pages }, (_, i) => i + 1).map((page) => {
              const isCurrentPage = page === result.pagination.page;
              const searchParamsForPage = new URLSearchParams();

              if (resolvedSearchParams.search) searchParamsForPage.set('search', resolvedSearchParams.search);
              if (resolvedSearchParams.tags) searchParamsForPage.set('tags', resolvedSearchParams.tags);
              if (page > 1) searchParamsForPage.set('page', page.toString());

              const href = `/dashboard${searchParamsForPage.toString() ? `?${searchParamsForPage.toString()}` : ''}`;

              return (
                <Link key={page} href={href}>
                  <Button
                    variant={isCurrentPage ? 'default' : 'outline'}
                    size="sm"
                  >
                    {page}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </>
    );
  } catch (error: unknown) {
    console.error('Failed to fetch articles:', error);

    if ((error as { message: string }).message.includes('Authentication failed')) {
      return (
        <div className="text-center py-12">
          <Alert variant="destructive" className="max-w-md mx-auto mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your session has expired. Please login again to access your articles.
            </AlertDescription>
          </Alert>
          <Link href="/login">
            <Button>Login Again</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <Alert variant="destructive" className="max-w-md mx-auto mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load articles. Please try refreshing the page.
          </AlertDescription>
        </Alert>
        <Link href="/dashboard">
          <Button>Refresh</Button>
        </Link>
      </div>
    );
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Articles</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your knowledge base
          </p>
        </div>
        <Link href="/dashboard/articles/new">
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      <SearchForm
        initialSearch={resolvedSearchParams.search}
        initialTags={resolvedSearchParams.tags?.split(',').filter(Boolean)}
      />

      <Suspense fallback={<PageLoadingSpinner />}>
        <ArticleList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
