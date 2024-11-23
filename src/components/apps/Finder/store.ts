import { create } from 'zustand';
import { supabase } from '../../../lib/supabase';

interface FinderState {
  currentPath: string;
  viewMode: 'grid' | 'list';
  selectedFiles: string[];
  sortBy: 'name' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
  theme: 'light' | 'dark';
  searchQuery: string;
  favorites: string[];
  recentFiles: string[];
  loading: boolean;
  files: any[];
  setCurrentPath: (path: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSelectedFiles: (files: string[]) => void;
  setSortBy: (sort: 'name' | 'date' | 'size') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSearchQuery: (query: string) => void;
  addToFavorites: (path: string) => void;
  removeFromFavorites: (path: string) => void;
  fetchFiles: (path: string) => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  deleteFiles: (paths: string[]) => Promise<void>;
  renameFile: (oldPath: string, newPath: string) => Promise<void>;
  moveFiles: (files: string[], destination: string) => Promise<void>;
}

export const useFinderStore = create<FinderState>((set, get) => ({
  currentPath: '/',
  viewMode: 'grid',
  selectedFiles: [],
  sortBy: 'name',
  sortOrder: 'asc',
  theme: 'dark',
  searchQuery: '',
  favorites: [],
  recentFiles: [],
  loading: false,
  files: [],

  setCurrentPath: (path) => set({ currentPath: path }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setTheme: (theme) => set({ theme: theme }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addToFavorites: (path) => 
    set((state) => ({ favorites: [...state.favorites, path] })),
  
  removeFromFavorites: (path) =>
    set((state) => ({ 
      favorites: state.favorites.filter((p) => p !== path) 
    })),

  fetchFiles: async (path) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .storage
        .from('files')
        .list(path);

      if (error) throw error;
      set({ files: data || [] });
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      set({ loading: false });
    }
  },

  createFolder: async (name) => {
    const { currentPath } = get();
    const path = `${currentPath}/${name}`.replace('//', '/');
    
    try {
      const { error } = await supabase
        .storage
        .from('files')
        .upload(`${path}/.keep`, new Blob([]));

      if (error) throw error;
      get().fetchFiles(currentPath);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  },

  deleteFiles: async (paths) => {
    try {
      const { error } = await supabase
        .storage
        .from('files')
        .remove(paths);

      if (error) throw error;
      get().fetchFiles(get().currentPath);
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  },

  renameFile: async (oldPath, newPath) => {
    try {
      const { error } = await supabase
        .storage
        .from('files')
        .move(oldPath, newPath);

      if (error) throw error;
      get().fetchFiles(get().currentPath);
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  },

  moveFiles: async (files, destination) => {
    try {
      await Promise.all(
        files.map((file) => {
          const newPath = `${destination}/${file.split('/').pop()}`;
          return supabase
            .storage
            .from('files')
            .move(file, newPath);
        })
      );
      get().fetchFiles(get().currentPath);
    } catch (error) {
      console.error('Error moving files:', error);
    }
  },
}));