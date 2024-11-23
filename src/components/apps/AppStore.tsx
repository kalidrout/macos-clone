import React, { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../store/useStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface App {
  id: string;
  title: string;
  description: string;
  icon_url: string;
  downloads: number;
  creator_id: string;
  created_at: string;
  version: string;
  component_code: string;
}

interface Creator {
  id: string;
  email: string;
}

export const AppStore: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [creators, setCreators] = useState<{[key: string]: Creator}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user, addWindow } = useStore();

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .eq('published', true)
      .order('downloads', { ascending: false });

    if (error) {
      console.error('Error fetching apps:', error);
      return;
    }

    setApps(data || []);

    // Fetch creator info from profiles table instead of auth.users
    if (data && data.length > 0) {
      const creatorIds = [...new Set(data.map(app => app.creator_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')  // Use profiles table instead of auth.users
        .select('id, email')
        .in('id', creatorIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      if (profiles) {
        const creatorMap = profiles.reduce((acc, profile) => ({
          ...acc,
          [profile.id]: profile
        }), {});
        setCreators(creatorMap);
      }
    }
  };

  const filteredApps = apps.filter(app => 
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInstall = async (app: App) => {
    if (!user) {
      useStore.getState().setShowAuth(true);
      return;
    }

    // Update download count
    const { error: updateError } = await supabase
      .from('apps')
      .update({ downloads: app.downloads + 1 })
      .eq('id', app.id);

    if (updateError) {
      console.error('Error updating download count:', updateError);
    }

    // Save to installed apps in Supabase
    if (user) {
      const { error: installError } = await supabase
        .from('installed_apps')
        .insert({
          user_id: user.id,
          app_id: app.id,
          desktop_icon: {
            id: `${app.title.toLowerCase()}-${Date.now()}`,
            title: app.title,
            icon_url: app.icon_url,
            position: { x: Math.random() * 100, y: Math.random() * 100 }
          }
        });

      if (installError) {
        console.error('Error saving installed app:', installError);
        return;
      }
    }

    // Notify user of successful installation
    alert(`${app.title} has been installed to your desktop!`);
  };

  const handleUpload = () => {
    if (!user) {
      useStore.getState().setShowAuth(true);
      return;
    }
    setShowUploadModal(true);
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">App Store</h1>
            <p className="text-muted-foreground">Discover and install new applications</p>
          </div>
          <Button onClick={handleUpload} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Upload App
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search apps..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* App Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.map((app) => (
            <div key={app.id} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
              <img
                src={app.icon_url}
                alt={app.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{app.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{app.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p>By {creators[app.creator_id]?.email}</p>
                    <p>v{app.version}</p>
                  </div>
                  <button
                    onClick={() => handleInstall(app)}
                    className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Download size={16} className="mr-1" />
                    Install
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} onUpload={fetchApps} />
      )}
    </div>
  );
};

interface UploadModalProps {
  onClose: () => void;
  onUpload: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [code, setCode] = useState('');
  const { user } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const { error } = await supabase.from('apps').insert({
      creator_id: user.id,
      title,
      description,
      icon_url: iconUrl,
      component_code: code,
      published: true
    });

    if (error) {
      console.error('Error uploading app:', error);
      return;
    }

    onUpload();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Upload New App</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Icon URL</label>
            <input
              type="url"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Component Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded font-mono"
              rows={10}
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 