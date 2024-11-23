import React, { useEffect } from 'react';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { Auth } from './components/Auth';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { Desktop } from './components/Desktop';

function App() {
  const { windows, user, setUser, userPreferences, showAuth, setShowAuth } = useStore();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowAuth(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user preferences if logged in
  useEffect(() => {
    if (user) {
      const fetchPreferences = async () => {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGNF') { // Ignore not found errors
          console.error('Error fetching preferences:', error);
          return;
        }

        if (data) {
          useStore.setState({
            userPreferences: {
              ...userPreferences,
              background_url: data.background_url
            }
          });
        }
      };

      fetchPreferences();
    }
  }, [user]);

  return (
    <div 
      className="h-screen w-screen relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${userPreferences.background_url})`,
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]">
        <MenuBar />
        <Desktop />
        {windows.map((window) => (
          <Window key={window.id} {...window} />
        ))}
        <Dock />
        
        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
              <Auth />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;