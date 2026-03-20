import { useEffect, useRef } from 'react';
import { authService } from '@/lib/api/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const REFRESH_INTERVAL = 13 * 60 * 1000;

export function GetAccessTokenFromRefreshTokenInterval() {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();
  const intervalIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function refresh() {
      try {
        await authService.refreshToken();
      } catch {
        clearUser();
        navigate('/signin', { replace: true });
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && user) {
        refresh();
      }
    }

    if (user) {
      intervalIdRef.current = setInterval(refresh, REFRESH_INTERVAL);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, clearUser, navigate]);

}

