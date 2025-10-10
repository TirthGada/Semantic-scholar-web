'use client';
import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading: boolean;
  searchMethod: 'embedding' | 'keyword';
  setSearchMethod: (method: 'embedding' | 'keyword') => void;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex items-center px-6 py-3"
    >
      <Search className="text-gray-400 w-6 h-6 mr-3" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for papers — e.g., Graph Neural Networks for Finance"
        disabled={loading}
        className="w-full text-gray-800 placeholder-gray-400 bg-transparent outline-none text-base"
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="ml-3 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-md disabled:opacity-50 flex items-center gap-2 transition-all"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
