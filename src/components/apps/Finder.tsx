import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, Grid, List } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified?: string;
}

export const Finder: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentPath, setCurrentPath] = useState<string[]>(['Home']);
  const [items, setItems] = useState<FileItem[]>([
    { id: '1', name: 'Documents', type: 'folder', modified: '2024-03-20' },
    { id: '2', name: 'Downloads', type: 'folder', modified: '2024-03-19' },
    { id: '3', name: 'Pictures', type: 'folder', modified: '2024-03-18' },
    { id: '4', name: 'notes.txt', type: 'file', size: '2.3 KB', modified: '2024-03-17' },
    { id: '5', name: 'report.pdf', type: 'file', size: '1.5 MB', modified: '2024-03-16' },
  ]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="border-b border-gray-800 p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPath(prev => prev.slice(0, -1))}
            disabled={currentPath.length === 1}
            className="p-1 hover:bg-gray-800 rounded disabled:opacity-50"
          >
            ←
          </button>
          <div className="flex items-center text-gray-400 text-sm">
            {currentPath.map((path, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight size={16} />}
                <span className="hover:text-white cursor-pointer">{path}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded ${view === 'grid' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <Grid size={18} className="text-gray-400" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded ${view === 'list' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <List size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {view === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center p-2 rounded hover:bg-gray-800 cursor-pointer"
              >
                {item.type === 'folder' ? (
                  <Folder size={48} className="text-blue-400 mb-2" />
                ) : (
                  <File size={48} className="text-gray-400 mb-2" />
                )}
                <span className="text-sm text-white text-center">{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-sm text-gray-400">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="pb-2">Name</th>
                <th className="pb-2">Size</th>
                <th className="pb-2">Modified</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800">
                  <td className="py-2 flex items-center">
                    {item.type === 'folder' ? (
                      <Folder size={18} className="text-blue-400 mr-2" />
                    ) : (
                      <File size={18} className="text-gray-400 mr-2" />
                    )}
                    {item.name}
                  </td>
                  <td>{item.size || '--'}</td>
                  <td>{item.modified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};