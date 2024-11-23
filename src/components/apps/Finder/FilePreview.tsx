import React from 'react';
import { useFinderStore } from './store';
import { File, Info } from 'lucide-react';

export const FilePreview: React.FC = () => {
  const { selectedFiles, files } = useFinderStore();
  const selectedFile = files.find((f) => f.id === selectedFiles[0]);

  if (!selectedFile) {
    return (
      <div className="w-64 border-l border-gray-700 bg-gray-800 p-4 flex flex-col items-center justify-center text-gray-400">
        <File size={48} className="mb-2" />
        <p className="text-sm text-center">Select a file to preview</p>
      </div>
    );
  }

  return (
    <div className="w-64 border-l border-gray-700 bg-gray-800 overflow-y-auto">
      <div className="p-4">
        <div className="flex flex-col items-center mb-4">
          <File size={64} className="text-gray-400 mb-2" />
          <h3 className="text-sm font-medium text-gray-300 text-center">
            {selectedFile.name}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="text-xs">
            <span className="text-gray-400">Type:</span>
            <span className="text-gray-300 ml-2">{selectedFile.type}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-400">Size:</span>
            <span className="text-gray-300 ml-2">{selectedFile.size}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-400">Created:</span>
            <span className="text-gray-300 ml-2">{selectedFile.created}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-400">Modified:</span>
            <span className="text-gray-300 ml-2">{selectedFile.modified}</span>
          </div>
        </div>
      </div>
    </div>
  );
};