'use client';
import { useState } from 'react';
import { Search, Sparkles, Hash, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  searchMethod: 'embedding' | 'keyword';
  setSearchMethod: (method: 'embedding' | 'keyword') => void;
}

export default function SearchBar({ onSearch, loading, searchMethod, setSearchMethod }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="mb-12 space-y-6">
      {/* Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex gap-2 bg-white rounded-2xl p-1 shadow-md border border-gray-200">
          {['embedding', 'keyword'].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setSearchMethod(method as 'embedding' | 'keyword')}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                searchMethod === method
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {method === 'embedding' ? <Sparkles className="inline w-5 h-5 mr-1" /> : <Hash className="inline w-5 h-5 mr-1" />}
              {method === 'embedding' ? 'Semantic Search' : 'Keyword Search'}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., machine learning in healthcare"
          disabled={loading}
          className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition bg-white shadow-md"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        {searchMethod === 'embedding'
          ? '🧠 Semantic search uses AI to understand meaning and context.'
          : '📝 Keyword search matches exact terms in papers.'}
      </p>
    </div>
  );
}
