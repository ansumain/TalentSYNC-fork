import { useEffect, useRef } from 'react';
import { renewAccessToken } from '@/lib/api/client';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import type { ApiError } from '../types/Client.type';

const REFRESH_INTERVAL = 13 * 60 * 1000;

function isAuthFailure(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const apiError = error as Partial<ApiError>;
  const status = apiError.status ?? apiError.statusCode;

  return status === 401 || status === 403;
}

export function GetAccessTokenFromRefreshTokenInterval() {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();
  const intervalIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function refresh() {
      try {
        await renewAccessToken();
      } catch (error) {
        if (isAuthFailure(error)) {
          clearUser();
          navigate('/signin', { replace: true });
        }
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

