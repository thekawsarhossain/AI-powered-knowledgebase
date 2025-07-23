'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Sparkles, MoreVertical, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  deleteArticleAction,
  summarizeArticleAction,
} from '@/lib/actions/article-actions';
import { toast } from 'sonner';

interface ArticleActionsProps {
  articleId: string;
  showSummarizeButton?: boolean;
  currentSummary?: string | null;
}

export function ArticleActions({
  articleId,
  showSummarizeButton = true,
  currentSummary,
}: ArticleActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteArticleAction(articleId);

      if (result.success) {
        toast.success('Article Deleted', {
          description: 'The article has been successfully deleted.',
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      toast.error('Error', {
        description:
          (error as { message: string }).message || 'Failed to delete article',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSummarize = async () => {
    try {
      setIsSummarizing(true);
      const result = await summarizeArticleAction(articleId);

      if (result.success) {
        toast.success('Summary Generated', {
          description: 'Article summary has been generated successfully.',
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      toast.error('Error', {
        description:
          (error as { message: string }).message ||
          'Failed to generate summary',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {showSummarizeButton && (
          <Button
            size="sm"
            variant={currentSummary ? 'outline' : 'default'}
            onClick={handleSummarize}
            disabled={isSummarizing || !!currentSummary}
          >
            {isSummarizing ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                {currentSummary ? 'Summarized' : 'Summarize'}
              </>
            )}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/articles/${articleId}`}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/articles/edit/${articleId}`}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex items-center text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              article and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Article'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
