import PaperCard from './PaperCard';
import { Paper } from '@/lib/types';

interface SearchResultsProps {
  papers: Paper[];
  loading: boolean;
  onSelectPaper: (paper: Paper) => void;
  selectedPaper: Paper | null;
}

export default function SearchResults({ papers, loading, onSelectPaper, selectedPaper }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="paper-card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Found {papers.length} papers
      </div>
      {papers.map((paper) => (
        <PaperCard
          key={paper.corpusid}
          paper={paper}
          onSelect={onSelectPaper}
          isSelected={selectedPaper?.corpusid === paper.corpusid}
        />
      ))}
    </div>
  );
}
