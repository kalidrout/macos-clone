import React, { useState } from 'react';
import { Apple, LogOut } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

export const MenuBar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { user, windows, removeWindow, minimizeWindow, maximizeWindow, addWindow } = useStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAbout = () => {
    addWindow({
      id: `about-${Date.now()}`,
      title: 'About This Mac',
      type: 'custom',
      minimized: false,
      maximized: false,
      position: { x: window.innerWidth / 2 - 250, y: window.innerHeight / 2 - 150 },
      size: { width: 500, height: 300 },
    });
  };

  const handleSystemPreferences = () => {
    addWindow({
      id: `preferences-${Date.now()}`,
      title: 'System Preferences',
      type: 'preferences',
      minimized: false,
      maximized: false,
      position: { x: 100, y: 100 },
      size: { width: 800, height: 600 },
    });
  };

  const handleNewWindow = () => {
    const activeApp = windows.find(w => !w.minimized);
    if (activeApp) {
      addWindow({
        id: `${activeApp.type}-${Date.now()}`,
        title: activeApp.title,
        type: activeApp.type,
        minimized: false,
        maximized: false,
        position: { x: activeApp.position.x + 30, y: activeApp.position.y + 30 },
        size: activeApp.size,
      });
    }
  };

  const handleCloseWindow = () => {
    const activeWindow = windows.find(w => !w.minimized);
    if (activeWindow) {
      removeWindow(activeWindow.id);
    }
  };

  const handleMinimizeWindow = () => {
    const activeWindow = windows.find(w => !w.minimized);
    if (activeWindow) {
      minimizeWindow(activeWindow.id);
    }
  };

  const handleMaximizeWindow = () => {
    const activeWindow = windows.find(w => !w.minimized);
    if (activeWindow) {
      maximizeWindow(activeWindow.id);
    }
  };

  const handleRestrictedAction = () => {
    if (!user) {
      useStore.getState().setShowAuth(true);
      return false;
    }
    return true;
  };

  const menus = {
    apple: [
      { label: 'About This Mac', action: handleAbout },
      { label: 'System Settings...', action: () => handleRestrictedAction() && handleSystemPreferences() },
      { type: 'separator' as const },
      { label: 'Sleep', action: () => document.body.style.opacity = '0.5' },
      { label: 'Restart...', action: () => window.location.reload() },
      { label: 'Shut Down...', action: handleLogout },
      { type: 'separator' as const },
      { label: 'Lock Screen', action: handleLogout },
      { label: 'Log Out...', action: handleLogout },
    ],
    file: [
      { label: 'New Window', action: handleNewWindow, shortcut: '⌘N' },
      { type: 'separator' as const },
      { label: 'Close Window', action: handleCloseWindow, shortcut: '⌘W' },
      { label: 'Close All', action: () => windows.forEach(w => removeWindow(w.id)) },
      { type: 'separator' as const },
      { label: 'Save', action: () => {}, shortcut: '⌘S', disabled: true },
      { label: 'Save As...', action: () => {}, shortcut: '⇧⌘S', disabled: true },
    ],
    edit: [
      { label: 'Undo', action: () => document.execCommand('undo'), shortcut: '⌘Z' },
      { label: 'Redo', action: () => document.execCommand('redo'), shortcut: '⇧⌘Z' },
      { type: 'separator' as const },
      { label: 'Cut', action: () => document.execCommand('cut'), shortcut: '⌘X' },
      { label: 'Copy', action: () => document.execCommand('copy'), shortcut: '⌘C' },
      { label: 'Paste', action: () => document.execCommand('paste'), shortcut: '⌘V' },
      { label: 'Select All', action: () => document.execCommand('selectAll'), shortcut: '⌘A' },
    ],
    view: [
      { label: 'Minimize', action: handleMinimizeWindow, shortcut: '⌘M' },
      { label: 'Zoom', action: handleMaximizeWindow },
      { type: 'separator' as const },
      { label: 'Enter Full Screen', action: () => document.documentElement.requestFullscreen(), shortcut: '⌃⌘F' },
    ],
    window: [
      { label: 'Minimize', action: handleMinimizeWindow, shortcut: '⌘M' },
      { label: 'Zoom', action: handleMaximizeWindow },
      { type: 'separator' as const },
      { label: 'Bring All to Front', action: () => windows.forEach(w => minimizeWindow(w.id)) },
    ],
    help: [
      { 
        label: 'MacOS Clone Help', 
        action: () => window.open('https://github.com/yourusername/macos-clone', '_blank') 
      },
      { type: 'separator' as const },
      { 
        label: 'Report an Issue...', 
        action: () => window.open('https://github.com/yourusername/macos-clone/issues', '_blank') 
      },
    ],
  };

  const renderMenuItem = (item: any, index: number) => {
    if (item.type === 'separator') {
      return (
        <DropdownMenu.Separator
          key={index}
          className="h-[1px] bg-white/10 my-1"
        />
      );
    }

    return (
      <DropdownMenu.Item
        key={index}
        className={`text-sm text-white px-2 py-1.5 rounded outline-none select-none flex items-center justify-between ${
          item.disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-default hover:bg-blue-600 focus:bg-blue-600'
        }`}
        onSelect={item.disabled ? undefined : item.action}
      >
        <span>{item.label}</span>
        {item.shortcut && (
          <span className="ml-4 text-xs text-gray-400">{item.shortcut}</span>
        )}
      </DropdownMenu.Item>
    );
  };

  const renderMenu = (menuKey: keyof typeof menus, label: string) => (
    <DropdownMenu.Root
      onOpenChange={(open) => setActiveMenu(open ? menuKey : null)}
      modal={false}
    >
      <DropdownMenu.Trigger
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          activeMenu === menuKey ? 'bg-white/10' : 'hover:bg-white/10'
        }`}
      >
        {label}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-gray-800/95 backdrop-blur-md rounded-lg p-1 shadow-xl border border-white/10"
          sideOffset={5}
        >
          {menus[menuKey].map((item, index) => renderMenuItem(item, index))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  return (
    <div className="h-8 bg-gray-800/95 backdrop-blur fixed top-0 left-0 right-0 flex items-center px-2 text-white z-50">
      <div className="flex items-center space-x-2">
        <DropdownMenu.Root
          onOpenChange={(open) => setActiveMenu(open ? 'apple' : null)}
          modal={false}
        >
          <DropdownMenu.Trigger className="p-1 hover:bg-white/10 rounded transition-colors">
            <Apple size={18} />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[220px] bg-gray-800/95 backdrop-blur-md rounded-lg p-1 shadow-xl border border-white/10"
              sideOffset={5}
            >
              {menus.apple.map((item, index) => renderMenuItem(item, index))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {renderMenu('file', 'File')}
        {renderMenu('edit', 'Edit')}
        {renderMenu('view', 'View')}
        {renderMenu('window', 'Window')}
        {renderMenu('help', 'Help')}
      </div>

      <div className="flex-1 text-center text-sm font-medium truncate">
        {windows.length > 0 && windows[0].title}
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm">{new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};