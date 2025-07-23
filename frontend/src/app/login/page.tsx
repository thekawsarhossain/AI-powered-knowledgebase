'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/forms/LoginForm';
import { PageLoadingSpinner } from '@/components/layout/LoadingSpinner';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading) {
        return <PageLoadingSpinner />;
    }

    if (user) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold text-gray-900">Knowledge Base</span>
                    </div>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
