import React from 'react';
import { 
  Folder, 
  Terminal, 
  Settings, 
  Code,
  Search,
  Store
} from 'lucide-react';
import { useStore } from '../store/useStore';

export const Dock: React.FC = () => {
  const { addWindow } = useStore();

  const apps = [
    { id: 'finder', icon: Folder, title: 'Finder' },
    { id: 'terminal', icon: Terminal, title: 'Terminal' },
    { id: 'editor', icon: Code, title: 'Editor' },
    { id: 'preferences', icon: Settings, title: 'System Preferences' },
    { id: 'spotlight', icon: Search, title: 'Spotlight' },
    { id: 'appstore', icon: Store, title: 'App Store' },
  ];

  const handleAppClick = (appId: string) => {
    addWindow({
      id: `${appId}-${Date.now()}`,
      title: apps.find(app => app.id === appId)?.title || '',
      type: appId as any,
      minimized: false,
      maximized: false,
      position: { x: 100, y: 100 },
      size: { width: 800, height: 600 },
    });
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-2 rounded-2xl flex items-center space-x-2">
      {apps.map(({ id, icon: Icon, title }) => (
        <button
          key={id}
          onClick={() => handleAppClick(id)}
          className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group relative"
        >
          <Icon size={32} className="text-white" />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {title}
          </span>
        </button>
      ))}
    </div>
  );
};