import { Paper } from '@/lib/types';
import { Users, Calendar, Quote, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface PaperCardProps {
  paper: Paper;
  rank: number;
}

export default function PaperCard({ paper, rank }: PaperCardProps) {
  const [loading, setLoading] = useState(false);

  const score = (paper as any)._score || 0;
  const relevancePercent = Math.min(Math.round((score / 2.5) * 100), 99);

  const getRelevanceColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 60) return 'bg-blue-500';
    return 'bg-yellow-400';
  };

  // 🔹 Fetch paper redirect URL
  const handleViewPaper = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/CorpusId:${paper.corpusid}?fields=url`,
        {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_SEMANTIC_SCHOLAR_API_KEY || '',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch paper URL');

      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert('No URL found for this paper.');
      }
    } catch (err) {
      console.error('Error fetching Semantic Scholar URL:', err);
      alert('Error fetching paper link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400 font-semibold">#{rank}</span>
        {score > 0 && (
          <div
            className={`h-2 rounded-full ${getRelevanceColor(relevancePercent)}`}
            style={{ width: `${relevancePercent}%` }}
          />
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-2 hover:text-blue-600 transition">
        {paper.title}
      </h3>

      {paper.authors && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Users className="w-4 h-4 mr-1 text-gray-500" />
          {paper.authors}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
        {paper.year && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {paper.year}
          </div>
        )}
        {paper.citationCount !== undefined && (
          <div className="flex items-center gap-1">
            <Quote className="w-4 h-4" /> {paper.citationCount.toLocaleString()} citations
          </div>
        )}
        {paper.venue && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
            {paper.venue}
          </span>
        )}
      </div>

      {paper.abstract && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{paper.abstract}</p>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleViewPaper}
          disabled={loading}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'View Paper'}
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
