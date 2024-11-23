import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Minus, Maximize2, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Terminal } from './apps/Terminal';
import { Editor } from './apps/Editor';
import { Finder } from './apps/Finder';
import { Preferences } from './apps/Preferences';
import { AppStore } from './apps/AppStore';
import { FitAddon } from 'xterm-addon-fit';

interface WindowProps {
  id: string;
  title: string;
  type: string;
}

export const Window: React.FC<WindowProps> = ({ id, title, type }) => {
  const { removeWindow, minimizeWindow, maximizeWindow, activeWindow, setActiveWindow } = useStore();
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isMaximized, setIsMaximized] = useState(false);
  const fitAddonRef = useRef<FitAddon>();

  const apps = {
    terminal: Terminal,
    editor: Editor,
    finder: Finder,
    preferences: Preferences,
    appstore: AppStore,
  };

  const AppComponent = apps[type as keyof typeof apps];

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    maximizeWindow(id);
  };

  const renderContent = () => {
    switch (type) {
      case 'finder':
        return <Finder />;
      case 'terminal':
        return <Terminal />;
      case 'editor':
        return <Editor />;
      case 'preferences':
        return <Preferences />;
      case 'appstore':
        return <AppStore />;
      default:
        return null;
    }
  };

  const handleResize = () => {
    if (type === 'terminal') {
      fitAddonRef.current?.fit();
    }
  };

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      }}
      minWidth={400}
      minHeight={300}
      bounds="window"
      onMouseDown={() => setActiveWindow(id)}
      enableResizing={!isMaximized}
      disableDragging={isMaximized}
      size={isMaximized ? { width: '100vw', height: 'calc(100vh - 32px)' } : size}
      position={isMaximized ? { x: 0, y: 32 } : undefined}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
      }}
      style={{
        transition: 'width 0.2s, height 0.2s, transform 0.2s',
      }}
      className={`${isMaximized ? 'rounded-none' : 'rounded-lg'} overflow-hidden`}
      onResize={handleResize}
    >
      <div 
        className={`flex flex-col h-full overflow-hidden shadow-2xl transition-all duration-200 ${
          activeWindow === id 
            ? 'ring-1 ring-blue-500 shadow-lg shadow-blue-500/20' 
            : 'ring-1 ring-gray-800'
        }`}
        style={{ 
          backgroundColor: 'rgba(32, 33, 36, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div 
          className={`h-8 flex items-center px-4 transition-colors duration-200 shrink-0 ${
            activeWindow === id ? 'bg-gray-800' : 'bg-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={() => removeWindow(id)}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors group relative"
            >
              <X size={8} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-900" />
            </button>
            <button
              onClick={() => minimizeWindow(id)}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors group relative"
            >
              <Minus size={8} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-yellow-900" />
            </button>
            <button
              onClick={handleMaximize}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors group relative"
            >
              <Maximize2 size={8} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-green-900" />
            </button>
          </div>
          <span className="flex-1 text-center text-sm font-medium text-gray-300 truncate">{title}</span>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-900/95">
          <div className="h-full w-full overflow-auto">
            {AppComponent && <AppComponent />}
          </div>
        </div>
      </div>
    </Rnd>
  );
};