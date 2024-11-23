import React from 'react';
import { useFinderStore } from './store';
import { FileIcon, FolderIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export const FileList: React.FC = () => {
  const { 
    files, 
    viewMode, 
    selectedFiles, 
    setSelectedFiles,
    currentPath,
    moveFiles
  } = useFinderStore();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      // Handle file upload to Supabase
    },
  });

  const handleFileClick = (id: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedFiles([...selectedFiles, id]);
    } else {
      setSelectedFiles([id]);
    }
  };

  if (viewMode === 'grid') {
    return (
      <div
        {...getRootProps()}
        className={`flex-1 p-4 overflow-auto grid grid-cols-6 gap-4 ${
          isDragActive ? 'bg-blue-500/10' : ''
        }`}
      >
        <input {...getInputProps()} />
        {files.map((file) => (
          <div
            key={file.id}
            onClick={(e) => handleFileClick(file.id, e)}
            className={`group flex flex-col items-center p-3 rounded-lg cursor-pointer ${
              selectedFiles.includes(file.id)
                ? 'bg-blue-500/20'
                : 'hover:bg-gray-800/50'
            }`}
          >
            {file.type === 'folder' ? (
              <FolderIcon size={40} className="text-blue-400" />
            ) : (
              <FileIcon size={40} className="text-gray-400" />
            )}
            <span className="mt-2 text-sm text-center text-gray-300 group-hover:text-blue-400">
              {file.name}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex-1 overflow-auto ${isDragActive ? 'bg-blue-500/10' : ''}`}
    >
      <input {...getInputProps()} />
      <table className="w-full">
        <thead className="sticky top-0 bg-gray-800">
          <tr>
            <th className="text-left p-2 text-sm font-medium text-gray-400">Name</th>
            <th className="text-left p-2 text-sm font-medium text-gray-400">Size</th>
            <th className="text-left p-2 text-sm font-medium text-gray-400">Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              onClick={(e) => handleFileClick(file.id, e)}
              className={`group ${
                selectedFiles.includes(file.id)
                  ? 'bg-blue-500/20'
                  : 'hover:bg-gray-800/50'
              }`}
            >
              <td className="p-2">
                <div className="flex items-center space-x-2">
                  {file.type === 'folder' ? (
                    <FolderIcon size={16} className="text-blue-400" />
                  ) : (
                    <FileIcon size={16} className="text-gray-400" />
                  )}
                  <span className="text-sm text-gray-300">{file.name}</span>
                </div>
              </td>
              <td className="p-2 text-sm text-gray-400">{file.size}</td>
              <td className="p-2 text-sm text-gray-400">{file.modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};