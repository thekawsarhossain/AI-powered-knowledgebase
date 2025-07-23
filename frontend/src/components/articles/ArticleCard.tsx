import { Article } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Sparkles } from 'lucide-react';
import { formatDate, truncateText } from '@/lib/utils';
import Link from 'next/link';
import { ArticleActions } from './ArticleActions';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg font-semibold">
          <Link
            href={`/dashboard/articles/${article.id}`}
            className="hover:text-primary transition-colors"
          >
            {article.title}
          </Link>
        </CardTitle>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {truncateText(article.body, 150)}
        </p>

        {article.summary && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium">AI Summary</h4>
            </div>
            <p className="text-sm text-muted-foreground">{article.summary}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-3 border-t">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(article.createdAt)}
        </div>

        <ArticleActions
          articleId={article.id}
          currentSummary={article.summary}
        />
      </CardFooter>
    </Card>
  );
}
