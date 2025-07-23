import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AI Knowledge Base',
    template: '%s | AI Knowledge Base',
  },
  description:
    'AI-powered knowledge base for managing and searching articles with intelligent summarization',
  keywords: 'knowledge base, AI, articles, search, summarization, productivity',
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'AI Knowledge Base',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    title: 'AI Knowledge Base',
    description:
      'AI-powered knowledge base for managing and searching articles',
    siteName: 'AI Knowledge Base',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Knowledge Base',
    description:
      'AI-powered knowledge base for managing and searching articles',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
