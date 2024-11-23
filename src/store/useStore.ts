import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { Window, UserPreferences } from '../types';
import { supabase } from '../lib/supabase';

const DEFAULT_BACKGROUND = 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?auto=format&fit=crop&q=80&w=3440&h=1920'; // Iceland beach

interface Store {
  windows: Window[];
  activeWindow: string | null;
  user: User | null;
  userPreferences: UserPreferences;
  setUser: (user: User | null) => void;
  addWindow: (window: Window) => void;
  removeWindow: (id: string) => void;
  setActiveWindow: (id: string | null) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  setBackground: (url: string) => Promise<void>;
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
}

export const useStore = create<Store>((set, get) => ({
  windows: [],
  activeWindow: null,
  user: null,
  userPreferences: {
    background_url: DEFAULT_BACKGROUND,
    theme: 'dark'
  },
  setUser: (user) => set({ user }),
  addWindow: (window) =>
    set((state) => ({
      windows: [...state.windows, window],
      activeWindow: window.id,
    })),
  removeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindow: state.activeWindow === id ? null : state.activeWindow,
    })),
  setActiveWindow: (id) => set({ activeWindow: id }),
  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
    })),
  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      ),
    })),
  setBackground: async (url) => {
    const { user } = get();
    if (!user) return;

    const { error } = await supabase
      .from('user_preferences')
      .upsert({ 
        user_id: user.id, 
        background_url: url 
      });

    if (!error) {
      set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          background_url: url
        }
      }));
    }
  },
  showAuth: false,
  setShowAuth: (show) => set({ showAuth: show }),
}));