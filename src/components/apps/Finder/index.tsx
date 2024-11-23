import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { FileList } from './FileList';
import { Toolbar } from './Toolbar';
import { useFinderStore } from './store';
import { Breadcrumb } from './Breadcrumb';
import { SearchBar } from './SearchBar';
import { FilePreview } from './FilePreview';

export const Finder: React.FC = () => {
  const [showPreview, setShowPreview] = useState(true);
  const { viewMode } = useFinderStore();

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-2 flex items-center space-x-2 border-b border-gray-700">
            <Breadcrumb />
            <SearchBar />
          </div>
          <div className="flex-1 flex min-h-0">
            <FileList />
            {showPreview && <FilePreview />}
          </div>
        </div>
      </div>
    </div>
  );
};