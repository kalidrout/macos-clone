import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Star } from 'lucide-react';

interface App {
  id: string;
  title: string;
  description: string;
  author: string;
  icon_url: string;
  downloads: number;
  rating: number;
}

export const AppStore: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    try {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('downloads', { ascending: false });

      if (error) throw error;
      setApps(data || []);
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6 bg-gray-900">
      <h2 className="text-2xl font-bold text-white mb-6">App Store</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div
            key={app.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start space-x-4">
              <img
                src={app.icon_url}
                alt={app.title}
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{app.title}</h3>
                <p className="text-sm text-gray-400">{app.author}</p>
                <p className="text-sm text-gray-300 mt-2">{app.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Download size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">{app.downloads}</span>
                    <Star size={16} className="text-yellow-400 ml-2" />
                    <span className="text-sm text-gray-400">{app.rating}/5</span>
                  </div>
                  <button className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-full transition-colors">
                    Install
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};