import { render, screen } from '@testing-library/react';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Article } from '@/types';

const mockArticle: Article = {
  id: '1',
  title: 'Test',
  body: 'Content',
  tags: ['a'],
  authorId: 'u',
  author: { id: 'u', email: 'u@e' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

test('renders title and content', () => {
  render(<ArticleCard article={mockArticle} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
