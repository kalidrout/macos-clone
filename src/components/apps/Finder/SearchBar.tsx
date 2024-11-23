import React from 'react';
import { Search } from 'lucide-react';
import { useFinderStore } from './store';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useFinderStore();

  return (
    <div className="relative flex-1 max-w-md">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        className="w-full bg-gray-700 text-gray-200 pl-8 pr-4 py-1 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <Search
        size={14}
        className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
    </div>
  );
};