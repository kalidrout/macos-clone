import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { Rnd } from 'react-rnd';

interface DesktopIcon {
  id: string;
  title: string;
  icon_url: string;
  position: { x: number; y: number };
}

interface InstalledApp {
  id: string;
  app_id: string;
  desktop_icon: DesktopIcon;
  app_data: {
    component_code: string;
  };
}

export const Desktop: React.FC = () => {
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const { user, addWindow } = useStore();

  useEffect(() => {
    if (user) {
      fetchInstalledApps();
    }
  }, [user]);

  const fetchInstalledApps = async () => {
    try {
      const { data, error } = await supabase
        .from('installed_apps')
        .select(`
          id,
          app_id,
          desktop_icon,
          apps (
            component_code
          )
        `)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching installed apps:', error);
        return;
      }

      const transformedApps: InstalledApp[] = (data || []).map(app => ({
        id: app.id,
        app_id: app.app_id,
        desktop_icon: app.desktop_icon,
        app_data: {
          component_code: app.apps[0]?.component_code
        }
      }));

      setInstalledApps(transformedApps);
    } catch (e) {
      console.error('Error fetching installed apps:', e);
    }
  };

  const handleIconDoubleClick = (app: InstalledApp) => {
    addWindow({
      id: app.desktop_icon.id,
      title: app.desktop_icon.title,
      type: 'custom',
      component_code: app.app_data.component_code,
      minimized: false,
      maximized: false,
      position: { x: 100, y: 100 },
      size: { width: 800, height: 600 },
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 pointer-events-auto">
        {installedApps.map((app) => (
          <Rnd
            key={app.desktop_icon.id}
            default={{
              x: app.desktop_icon.position.x,
              y: app.desktop_icon.position.y,
              width: 80,
              height: 90,
            }}
            dragGrid={[20, 20]}
            bounds="parent"
          >
            <div
              className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"
              onDoubleClick={() => handleIconDoubleClick(app)}
            >
              <img
                src={app.desktop_icon.icon_url}
                alt={app.desktop_icon.title}
                className="w-16 h-16 object-cover rounded"
              />
              <span className="mt-1 text-sm text-white text-center break-words w-full">
                {app.desktop_icon.title}
              </span>
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}; 