import React, { useState } from 'react';
import { 
  Monitor, 
  Volume2, 
  Wifi, 
  Palette, 
  User, 
  Lock, 
  Globe, 
  Bell, 
  HardDrive,
  Clock,
  Image
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { supabase } from '../../lib/supabase';

interface SettingsPanel {
  id: string;
  icon: React.ElementType;
  label: string;
  component: React.FC;
}

// Appearance Settings Panel
const AppearancePanel: React.FC = () => {
  const { userPreferences, setBackground } = useStore();
  const [backgroundUrl, setBackgroundUrl] = useState(userPreferences.background_url);

  const wallpapers = [
    'https://images.unsplash.com/photo-1520769669658-f07657f5a307',
    'https://images.unsplash.com/photo-1476820865390-c52aeebb9891',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    'https://images.unsplash.com/photo-1481697943534-ea55b5ce970b',
  ];

  const handleBackgroundChange = async (url: string) => {
    setBackgroundUrl(url);
    await setBackground(url);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Appearance</h2>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Desktop Wallpaper</h3>
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map((url) => (
            <div
              key={url}
              className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer ring-2 transition-all ${
                backgroundUrl === url ? 'ring-blue-500' : 'ring-transparent'
              }`}
              onClick={() => handleBackgroundChange(url)}
            >
              <img
                src={url}
                alt="Wallpaper"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Custom Wallpaper</h3>
        <input
          type="url"
          value={backgroundUrl}
          onChange={(e) => handleBackgroundChange(e.target.value)}
          placeholder="Enter image URL"
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-blue-500 outline-none"
        />
      </div>
    </div>
  );
};

// Display Settings Panel
const DisplayPanel: React.FC = () => {
  const [brightness, setBrightness] = useState(100);
  const [nightShift, setNightShift] = useState(false);
  const [resolution, setResolution] = useState('native');

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    document.documentElement.style.filter = `brightness(${value}%)`;
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Display</h2>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Brightness</h3>
        <input
          type="range"
          min="50"
          max="100"
          value={brightness}
          onChange={(e) => handleBrightnessChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Night Shift</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={nightShift}
            onChange={(e) => setNightShift(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
        </label>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Resolution</h3>
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 rounded-md border border-gray-700 focus:border-blue-500 outline-none"
        >
          <option value="native">Default for display</option>
          <option value="1920x1080">1920 x 1080</option>
          <option value="2560x1440">2560 x 1440</option>
          <option value="3840x2160">3840 x 2160</option>
        </select>
      </div>
    </div>
  );
};

// Sound Settings Panel
const SoundPanel: React.FC = () => {
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    // Implement actual volume control here
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Sound</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Volume2 className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="flex-1 mx-4"
          />
          <span className="text-sm text-gray-400">{volume}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Mute</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={muted}
              onChange={(e) => setMuted(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
          </label>
        </div>
      </div>
    </div>
  );
};

export const Preferences: React.FC = () => {
  const [activePanel, setActivePanel] = useState('appearance');

  const panels: SettingsPanel[] = [
    { id: 'appearance', icon: Palette, label: 'Appearance', component: AppearancePanel },
    { id: 'display', icon: Monitor, label: 'Displays', component: DisplayPanel },
    { id: 'sound', icon: Volume2, label: 'Sound', component: SoundPanel },
    { id: 'wifi', icon: Wifi, label: 'Network', component: () => <div>Network Settings</div> },
    { id: 'notifications', icon: Bell, label: 'Notifications', component: () => <div>Notifications Settings</div> },
    { id: 'users', icon: User, label: 'Users & Groups', component: () => <div>Users Settings</div> },
    { id: 'security', icon: Lock, label: 'Security', component: () => <div>Security Settings</div> },
    { id: 'storage', icon: HardDrive, label: 'Storage', component: () => <div>Storage Settings</div> },
    { id: 'time', icon: Clock, label: 'Date & Time', component: () => <div>Time Settings</div> },
    { id: 'language', icon: Globe, label: 'Language', component: () => <div>Language Settings</div> },
  ];

  const ActivePanelComponent = panels.find(p => p.id === activePanel)?.component || (() => null);

  return (
    <div className="h-full flex bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 overflow-y-auto">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search Settings"
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 p-2">
          {panels.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActivePanel(id)}
              className={`flex flex-col items-center p-4 rounded-lg text-sm space-y-2 transition-colors ${
                activePanel === id ? 'bg-blue-500' : 'hover:bg-gray-800'
              }`}
            >
              <Icon size={24} />
              <span className="text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <ActivePanelComponent />
      </div>
    </div>
  );
};