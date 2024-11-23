export interface Window {
  id: string;
  title: string;
  type: 'finder' | 'terminal' | 'editor' | 'preferences' | 'appstore' | 'custom';
  minimized: boolean;
  maximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  component_code?: string;
}

export interface File {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: File[];
  path: string;
  icon: string;
}

export interface UserPreferences {
  background_url: string;
  theme: 'light' | 'dark';
}