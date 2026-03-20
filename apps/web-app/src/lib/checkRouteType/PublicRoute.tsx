import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { getDefaultRouteForRoles } from '@/lib/auth/defaultRoute';
import { RouteLoader } from '@/components/RouteLoader';

interface PublicRouteProps {
    children: ReactElement;
}

export function PublicRoute({ children }: PublicRouteProps) {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);

    if(loading) return <RouteLoader />;
    
    if (user) return <Navigate to={getDefaultRouteForRoles(user.roles)} replace />;
    

    return children;
}
