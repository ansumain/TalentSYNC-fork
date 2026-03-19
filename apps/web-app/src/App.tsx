import './App.css';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { GetAccessTokenFromRefreshTokenInterval } from './lib/api/getAccessToken';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './stores/authStore';

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Initialize auth token refresh mechanism
  GetAccessTokenFromRefreshTokenInterval();

  return (
    <div className='min-h-screen w-full'>
      <Toaster position='bottom-right' richColors />
      <AppRoutes />
    </div>
  );
}

export default App;
