import { Paper } from '@/lib/types';
import { Users, Calendar, Quote, ExternalLink } from 'lucide-react';

interface PaperCardProps {
  paper: Paper;
  rank: number;
}

export default function PaperCard({ paper, rank }: PaperCardProps) {
  if (!paper.title) return null; // Skip papers without a title

  const score = (paper as any)._score || 0;
  const relevancePercent = Math.min(Math.round((score / 2.5) * 100), 99);

  const getRelevanceColor = (percent: number) => {
    if (percent >= 80) return 'from-green-400 to-green-600';
    if (percent >= 60) return 'from-blue-400 to-blue-600';
    return 'from-yellow-400 to-orange-500';
  };

  return (
    <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      {/* Rank & Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold text-gray-500">#{rank}</div>
        {score > 0 && (
          <div
            className={`w-24 h-2 rounded-full bg-gradient-to-r ${getRelevanceColor(
              relevancePercent
            )}`}
            style={{ width: `${relevancePercent}%` }}
            title={`Relevance: ${relevancePercent}%`}
          />
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {paper.title}
      </h3>

      {/* Authors */}
      {paper.authors && (
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Users className="w-4 h-4 mr-1" />
          {paper.authors}
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
        {paper.year && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {paper.year}
          </div>
        )}
        {paper.citationCount !== undefined && (
          <div className="flex items-center gap-1">
            <Quote className="w-4 h-4" />
            {paper.citationCount.toLocaleString()} citations
          </div>
        )}
        {paper.venue && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
            {paper.venue}
          </span>
        )}
      </div>

      {/* Abstract */}
      {paper.abstract && (
        <p className="text-sm text-gray-700 line-clamp-3 mb-3">{paper.abstract}</p>
      )}

      {/* View Paper */}
      {paper.url && (
        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          View Paper <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
