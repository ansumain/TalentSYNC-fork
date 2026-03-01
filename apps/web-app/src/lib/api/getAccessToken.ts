import { useEffect, useRef } from 'react';
import { authService } from '@/lib/api/auth.service';
import { useAuthStore } from '@/stores/authStore';

// Interval in milliseconds (13 minutes)
const REFRESH_INTERVAL = 13 * 60 * 1000;

export function GetAccessTokenFromRefreshTokenInterval() {
  const user = useAuthStore((state) => state.user);
  const intervalIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function refresh() {
      try {
        await authService.refreshToken();
      } catch (e) {
        console.log('error fetching access token');
      }
    }

    if (user) {
      intervalIdRef.current = setInterval(() => {
        refresh();
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [user]);
}
