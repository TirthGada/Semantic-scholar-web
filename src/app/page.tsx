'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import PaperCard from '@/components/PaperCard';
import { Paper } from '@/lib/types';
import { Search, Sparkles, Database } from 'lucide-react';

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'embedding' | 'keyword'>('embedding');
  const [searchTime, setSearchTime] = useState<number>(0);

  const handleSearch = async (query: string) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, method: searchMethod, size: 100 }),
      });

      const data = await response.json();
      if (data.papers) {
        // Filter out papers with empty titles
        setPapers(data.papers.filter((p: Paper) => p.title));
        setSearchTime(Date.now() - startTime);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-4 shadow-md">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">VERITUS</h1>
          <p className="text-gray-600 text-lg mb-1">Academic Paper Search</p>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Database className="w-4 h-4" />
            <span>100M+ Papers</span>
          </div>
        </header>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          searchMethod={searchMethod}
          setSearchMethod={setSearchMethod}
        />

        {/* Search Results */}
        {!loading && papers.length > 0 && (
          <div className="mt-8">
            <p className="text-gray-600 text-sm mb-4 text-center">
              Found <span className="font-semibold text-gray-900">{papers.length}</span> papers
              {searchTime > 0 && ` in ${(searchTime / 1000).toFixed(2)}s`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {papers.map((paper, index) => (
                <PaperCard key={paper.corpusid || index} paper={paper} rank={index + 1} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && papers.length === 0 && (
          <div className="text-center mt-16 text-gray-500">
            <Search className="mx-auto w-16 h-16 mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold mb-2">Discover Academic Papers</h2>
            <p className="max-w-md mx-auto">
              Search through millions of research papers using AI-powered semantic search or traditional keywords.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow animate-pulse border border-gray-100"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
