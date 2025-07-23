'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';
import { Article } from '@/types';
import { Save, FileText, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createArticleAction, updateArticleAction } from '@/lib/actions/article-actions';
import { toast } from 'sonner';

const articleSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters'),
    body: z.string()
        .min(1, 'Content is required')
        .min(10, 'Content must be at least 10 characters'),
    tags: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormProps {
    initialData?: Article;
    mode: 'create' | 'edit';
}

export function ArticleForm({ initialData, mode }: ArticleFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch
    } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: initialData?.title || '',
            body: initialData?.body || '',
            tags: initialData?.tags?.join(', ') || '',
        },
        mode: 'onChange'
    });

    const handleFormSubmit = (data: ArticleFormData) => {
        const tags = data.tags
            ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            : [];

        const articleData = {
            title: data.title,
            body: data.body,
            tags,
        };

        startTransition(async () => {
            try {
                let result;

                if (mode === 'create') {
                    result = await createArticleAction(articleData);
                } else {
                    result = await updateArticleAction(initialData!.id, articleData);
                }

                if (result.success) {
                    toast(mode === 'create' ? "Article Created" : "Article Updated", {
                        description: `Your article has been ${mode === 'create' ? 'created' : 'updated'} successfully.`,
                    });
                    router.push('/dashboard');
                    router.refresh();
                } else {
                    throw new Error(result.error);
                }
            } catch (error: unknown) {
                toast("Error", {
                    description: (error as { message: string }).message || `Failed to ${mode} article`,
                });
            }
        });
    };

    const bodyContent = watch('body');
    const wordCount = bodyContent ? bodyContent.trim().split(/\s+/).length : 0;
    const charCount = bodyContent ? bodyContent.length : 0;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {mode === 'create' ? 'Create New Article' : 'Edit Article'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            {...register('title')}
                            disabled={isPending}
                            placeholder="Enter article title..."
                            className="text-lg"
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="body">Content</Label>
                            <div className="text-xs text-muted-foreground">
                                {wordCount} words · {charCount} characters
                            </div>
                        </div>
                        <Textarea
                            id="body"
                            {...register('body')}
                            disabled={isPending}
                            placeholder="Write your article content here..."
                            rows={15}
                            className="min-h-[300px] resize-none"
                        />
                        {errors.body && (
                            <p className="text-sm text-destructive">{errors.body.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags" className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Tags
                        </Label>
                        <Input
                            id="tags"
                            {...register('tags')}
                            disabled={isPending}
                            placeholder="javascript, react, tutorial (comma-separated)"
                        />
                        <p className="text-xs text-muted-foreground">
                            Add tags to help categorize your article. Separate multiple tags with commas.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            type="submit"
                            disabled={isPending || !isValid}
                            className="flex items-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {mode === 'create' ? 'Create Article' : 'Update Article'}
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
