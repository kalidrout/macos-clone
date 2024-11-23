import React from 'react';
import { 
  Folder, 
  Star, 
  Clock, 
  Download, 
  Home,
  Image,
  File,
  Music,
  Video
} from 'lucide-react';
import { useFinderStore } from './store';

export const Sidebar: React.FC = () => {
  const { favorites, currentPath, setCurrentPath } = useFinderStore();

  const sections = [
    {
      title: 'Favorites',
      items: [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: Download, label: 'Downloads', path: '/downloads' },
        { icon: Image, label: 'Pictures', path: '/pictures' },
        { icon: Music, label: 'Music', path: '/music' },
        { icon: Video, label: 'Videos', path: '/videos' },
      ],
    },
    {
      title: 'Quick Access',
      items: [
        { icon: Clock, label: 'Recent', path: '/recent' },
        { icon: Star, label: 'Starred', path: '/starred' },
      ],
    },
  ];

  return (
    <div className="w-48 bg-gray-800 flex flex-col overflow-y-auto">
      {sections.map((section) => (
        <div key={section.title} className="p-2">
          <h3 className="text-xs font-semibold text-gray-500 px-2 mb-1">
            {section.title}
          </h3>
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <button
                key={item.path}
                onClick={() => setCurrentPath(item.path)}
                className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm ${
                  currentPath === item.path
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};