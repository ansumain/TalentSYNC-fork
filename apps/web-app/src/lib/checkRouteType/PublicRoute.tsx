import { useEffect } from 'react';
import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteForRoles } from '@/lib/auth/defaultRoute';

interface PublicRouteProps {
    children: ReactElement;
}

export function PublicRoute({ children }: PublicRouteProps) {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const fetchUser = useAuthStore((state) => state.fetchUser);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    if(loading) return null;
    
    if (user) return <Navigate to={getDefaultRouteForRoles(user.roles)} replace />;
    

    return children;
}
