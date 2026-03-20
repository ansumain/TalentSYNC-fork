import './App.css';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { renewAccessToken } from './lib/api/client';
import { GetAccessTokenFromRefreshTokenInterval } from './lib/api/getAccessToken';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './stores/authStore';

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    let cancelled = false;

    async function initiateAuth() {
      await fetchUser();
      if (cancelled || useAuthStore.getState().user) {
        return;
      }

      try {
        await renewAccessToken();
        if (!cancelled) {
          await fetchUser();
        }
      } catch {}
    }

    initiateAuth();

    return () => {
      cancelled = true;
    };
  }, [fetchUser]);

  // refresh token refresh mechanism using time interval of 13mins
  GetAccessTokenFromRefreshTokenInterval();

  return (
    <div className='min-h-screen w-full'>
      <Toaster position='bottom-right' richColors />
      <AppRoutes />
    </div>
  );
}

export default App;
