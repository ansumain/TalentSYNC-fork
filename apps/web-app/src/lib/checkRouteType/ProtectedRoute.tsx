import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { RouteLoader } from '../../components/RouteLoader';
import { getDefaultRouteForRoles } from '../auth/defaultRoute';

interface ProtectedRouteProps {
    children: ReactElement;
    allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);
    const location = useLocation();

    if (loading) return <RouteLoader />;

    if (!user) return <Navigate to="/signin" state={{ from: location }} replace />;

    if (allowedRoles && allowedRoles.length > 0) {
        const hasAllowedRole = user.roles?.some(role => allowedRoles.includes(role));

        if (!hasAllowedRole) {
            const fallbackPath = getDefaultRouteForRoles(user.roles);
            // const safeFallbackPath = fallbackPath === location.pathname ? '/signin' : fallbackPath;
            // return <Navigate to={safeFallbackPath} replace />;

            return <Navigate to={fallbackPath} replace />;
        }
    }

    return children;
}
