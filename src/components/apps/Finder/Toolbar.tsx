import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  List,
  Settings,
  Plus,
  Trash,
  Search
} from 'lucide-react';
import { useFinderStore } from './store';

export const Toolbar: React.FC = () => {
  const { viewMode, setViewMode, currentPath, setCurrentPath } = useFinderStore();

  return (
    <div className="h-10 flex items-center px-2 space-x-2 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center space-x-1">
        <button className="p-1.5 hover:bg-gray-700 rounded-md">
          <ChevronLeft size={16} className="text-gray-400" />
        </button>
        <button className="p-1.5 hover:bg-gray-700 rounded-md">
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center space-x-1">
        <button 
          className={`p-1.5 rounded-md ${
            viewMode === 'grid' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          onClick={() => setViewMode('grid')}
        >
          <Grid size={16} className="text-gray-400" />
        </button>
        <button 
          className={`p-1.5 rounded-md ${
            viewMode === 'list' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          onClick={() => setViewMode('list')}
        >
          <List size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="flex items-center space-x-1">
        <button className="p-1.5 hover:bg-gray-700 rounded-md">
          <Plus size={16} className="text-gray-400" />
        </button>
        <button className="p-1.5 hover:bg-gray-700 rounded-md">
          <Trash size={16} className="text-gray-400" />
        </button>
        <button className="p-1.5 hover:bg-gray-700 rounded-md">
          <Search size={16} className="text-gray-400" />
        </button>
        <button className="p-1.5 hover:bg-gray-700 rounded-md">
          <Settings size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};