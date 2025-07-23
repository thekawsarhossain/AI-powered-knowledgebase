import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen, Search, Sparkles, ArrowRight, Users, Shield, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI-Powered Knowledge Base - Organize, Search, and Summarize',
  description: 'Create, organize, and discover your knowledge with intelligent AI summarization. Transform your articles into actionable insights with powerful search capabilities.',
  openGraph: {
    title: 'AI-Powered Knowledge Base',
    description: 'Create, organize, and discover your knowledge with intelligent AI summarization',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">Knowledge Base</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered
            <span className="text-primary block">Knowledge Base</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create, organize, and discover your knowledge with intelligent AI summarization.
            Transform your articles into actionable insights with powerful search capabilities.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center group">
            <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Create & Organize</h3>
              <p className="text-gray-600 leading-relaxed">
                Write rich articles with markdown support, organize them with tags,
                and build your personal knowledge repository.
              </p>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Smart Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find exactly what you need with powerful full-text search,
                tag filtering, and intelligent content discovery.
              </p>
            </div>
          </div>

          <div className="text-center group">
            <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">AI Summaries</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant, intelligent summaries of your articles powered by
                advanced AI to quickly grasp key insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Modern Knowledge Workers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to capture, organize, and leverage your knowledge effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Personal & Secure</h4>
                <p className="text-gray-600 text-sm">
                  Your articles are private and secure. Only you can access and manage your content.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast & Reliable</h4>
                <p className="text-gray-600 text-sm">
                  Built with modern technologies for lightning-fast performance and reliability.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Smart Analytics</h4>
                <p className="text-gray-600 text-sm">
                  Track your writing progress and discover insights about your knowledge base.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Knowledge?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of knowledge workers who use our platform to organize,
            discover, and leverage their expertise.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-12 py-6">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">Knowledge Base</span>
          </div>
          <p className="text-center text-gray-400">
            © 2024 Knowledge Base. Built with ❤️ for knowledge workers.
          </p>
        </div>
      </footer>
    </div>
  );
}
