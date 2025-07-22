'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/appStore';
import { searchApps } from '@/lib/api';
import { AIApp } from '@/types';

interface SearchBarProps {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ 
  placeholder = 'アプリを検索...', 
  size = 'md',
  onSearch,
  className = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AIApp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setFilters } = useAppStore();

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  };

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const results = await searchApps(query.trim(), 5);
          setSuggestions(results);
          setIsOpen(true);
        } catch (error) {
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      if (onSearch) {
        onSearch(finalQuery.trim());
      } else {
        // Navigate to apps page with search query
        setFilters({ search: finalQuery.trim() });
        router.push('/apps');
      }
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSuggestionClick = (app: AIApp) => {
    router.push(`/apps/${app.id}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          className={`block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors ${sizeClasses[size]}`}
          placeholder={placeholder}
        />
      </form>

      {/* Search suggestions dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-center">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-sm text-gray-500">検索中...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                検索結果
              </div>
              {suggestions.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleSuggestionClick(app)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {app.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {app.description}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                        {app.usage_count} 回利用
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              {suggestions.length >= 5 && (
                <button
                  onClick={() => handleSearch()}
                  className="w-full px-4 py-3 text-center text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 focus:bg-primary-50 focus:outline-none transition-colors border-t border-gray-100"
                >
                  すべての検索結果を表示 →
                </button>
              )}
            </>
          ) : query.trim().length > 1 ? (
            <div className="px-4 py-3 text-center text-sm text-gray-500">
              検索結果が見つかりませんでした
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}