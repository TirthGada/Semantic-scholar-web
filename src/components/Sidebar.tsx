import { History, Plus } from 'lucide-react';

interface SidebarProps {
  onNewSearch: () => void;
}

export default function Sidebar({ onNewSearch }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <button
        onClick={onNewSearch}
        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors mb-6"
      >
        <Plus className="w-4 h-4" />
        <span>New search</span>
      </button>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Search History</h3>
        <input
          type="text"
          placeholder="Find a specific search..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-4"
        />
      </div>
    </aside>
  );
}
