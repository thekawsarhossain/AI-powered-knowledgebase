import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-md">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go to Dashboard
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
