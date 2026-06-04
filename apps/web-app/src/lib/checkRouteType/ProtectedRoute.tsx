import type { ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { RouteLoader } from '../../components/RouteLoader';

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
        const normalizedAllowedRoles = new Set(allowedRoles.map((role) => role.toLowerCase()));
        const hasAllowedRole = (user.roles ?? []).some((role) => normalizedAllowedRoles.has(role.toLowerCase()));

        if (!hasAllowedRole) {
            return <Navigate to="/unauthorized" replace state={{ from: `${location.pathname}${location.search}${location.hash}` }} />;
        }
    }

    return children;
}
