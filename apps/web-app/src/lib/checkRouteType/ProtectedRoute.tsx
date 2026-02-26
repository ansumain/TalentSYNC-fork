import { useEffect } from 'react';
import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
    children: ReactElement;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const fetchUser = useAuthStore((state) => state.fetchUser);
    const location = useLocation();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    if(loading) return null;

    if (!user) return <Navigate to="/signin" state={{ from: location }} replace />;

    return children;
}
