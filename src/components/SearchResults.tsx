import PaperCard from './PaperCard';
import { Paper } from '@/lib/types';
import { Search } from 'lucide-react';

interface SearchResultsProps {
  papers: Paper[];
  loading: boolean;
  onSelectPaper: (paper: Paper) => void;
  selectedPaper: Paper | null;
  searchTime?: number;
}

export default function SearchResults({ papers, loading, searchTime }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="mt-10 space-y-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (papers.length === 0)
    return (
      <div className="text-center mt-16 text-gray-500">
        <Search className="mx-auto w-12 h-12 mb-3 text-blue-500" />
        <h2 className="text-xl font-semibold mb-2">Find Your Next Paper</h2>
        <p>Start by typing a topic or title above.</p>
      </div>
    );

  return (
    <div className="mt-6">
      <p className="text-gray-600 text-sm mb-4 text-center">
        Found <span className="font-semibold text-gray-900">{papers.length}</span> papers
        {searchTime && searchTime > 0 && ` in ${(searchTime / 1000).toFixed(2)}s`}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {papers.map((paper, index) => (
          <PaperCard key={paper.corpusid || index} paper={paper} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
