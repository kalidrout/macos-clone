import React, { useState } from 'react';
import { Save, FileText, FolderOpen } from 'lucide-react';

export const Editor: React.FC = () => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    // In a real app, implement file saving logic here
    setIsDirty(false);
    console.log('Saving file:', fileName, content);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="border-b border-gray-800 p-2 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors group"
            title="Save (⌘S)"
          >
            <Save size={18} className="text-gray-400 group-hover:text-white" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-800 rounded transition-colors group"
            title="New File (⌘N)"
          >
            <FileText size={18} className="text-gray-400 group-hover:text-white" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-800 rounded transition-colors group"
            title="Open (⌘O)"
          >
            <FolderOpen size={18} className="text-gray-400 group-hover:text-white" />
          </button>
        </div>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="px-2 py-1 bg-gray-800 rounded text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
        />
        {isDirty && <span className="text-xs text-gray-500">Unsaved changes</span>}
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        className="flex-1 bg-gray-900 text-white p-4 resize-none outline-none font-mono"
        placeholder="Start typing..."
      />
    </div>
  );
};