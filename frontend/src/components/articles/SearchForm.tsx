'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, Tag } from 'lucide-react';

interface SearchFormProps {
  initialSearch?: string;
  initialTags?: string[];
}

export function SearchForm({
  initialSearch = '',
  initialTags = [],
}: SearchFormProps) {
  const [search, setSearch] = useState(initialSearch);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    ((searchTerm: string, tags: string[]) => {
      const params = new URLSearchParams(searchParams);

      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }

      if (tags.length > 0) {
        params.set('tags', tags.join(','));
      } else {
        params.delete('tags');
      }

      params.delete('page');

      router.push(`/dashboard?${params.toString()}`);
    }) as (searchTerm: string, tags: string[]) => void,
    [searchParams, router]
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateUrl(value, selectedTags);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      const newTags = [...selectedTags, trimmedTag];
      setSelectedTags(newTags);
      setTagInput('');
      updateUrl(search, newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    updateUrl(search, newTags);
  };

  const clearAll = () => {
    setSearch('');
    setSelectedTags([]);
    setTagInput('');
    router.push('/dashboard');
  };

  const hasFilters = search.length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles by title or content..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="relative">
            <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Add tags to filter (press Enter to add)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              onBlur={addTag}
              className="pl-10"
            />
          </div>
        </div>

        {hasFilters && (
          <Button
            variant="outline"
            onClick={clearAll}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filtering by:
          </div>
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={() => removeTag(tag)}
            >
              {tag}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
