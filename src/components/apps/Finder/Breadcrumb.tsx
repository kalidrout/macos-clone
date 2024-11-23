import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useFinderStore } from './store';

export const Breadcrumb: React.FC = () => {
  const { currentPath, setCurrentPath } = useFinderStore();

  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex items-center space-x-1 text-sm text-gray-400">
      <button
        onClick={() => setCurrentPath('/')}
        className="hover:text-gray-300"
      >
        Root
      </button>
      {pathParts.map((part, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} />
          <button
            onClick={() => {
              const newPath = '/' + pathParts.slice(0, index + 1).join('/');
              setCurrentPath(newPath);
            }}
            className="hover:text-gray-300"
          >
            {part}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};