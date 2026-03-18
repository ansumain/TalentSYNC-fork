// App Routes Component

import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ProtectedRoute } from '../lib/checkRouteType/ProtectedRoute';
import { PublicRoute } from '../lib/checkRouteType/PublicRoute';
import { useLazyPages } from '../hooks/lazy-pages';
import { RouteLoader } from '../components/RouteLoader';
import RouteSkeleton from '../components/RouteSkeleton';
import type { RolesModule } from '../types/app-routes.types';

function AppRoutes() {
  const user = useAuthStore((state: { user: { roles: string[] } | null }) => state.user);

  // Get all lazy-loaded page components from centralized hook
  const {
    LoginPage,
    SignupPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    UploadPage,
    CandidateTablePage,
    CandidateProfilePage,
    JobTablePage,
    JobDetailPage,
    JobBoardPage,
    ApplicationsPage,
    AdminApplicationsPage,
    MyResumesPage,
    InterviewsPage,
    MyInterviewsPage,
    CandidateInterviewsPage,
    AnalyticsDashboardPage,
  } = useLazyPages();

  // State for lazy-loaded role constants
  const [roles, setRoles] = useState<RolesModule | null>(null);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // Lazy load role constants on component mount
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const module = await import('../constants/roles.constants');
        setRoles(module.default as RolesModule);
      } catch (error) {
        console.error('Failed to load roles:', error);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  // Show skeleton while roles are loading
  if (isLoadingRoles || !roles) {
    return <RouteSkeleton />;
  }

  const {
    UPLOAD_ROLES,
    CANDIDATE_ROLES,
    JOB_ROLES,
    APPLICATIONS_ROLES,
    INTERVIEWS_ROLES,
    ANALYTICS_ROLES,
    ADMIN_ROLES,
  } = roles;

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Root redirect based on auth state */}
        <Route
          path='/'
          element={
            user ? (
              <Navigate to='/candidates' replace />
            ) : (
              <Navigate to='/signin' replace />
            )
          }
        />

        {/* PUBLIC ROUTES */}

        {/* Accessible without authentication */}

        <Route
          path='/signin'
          element={
            user ? (
              <Navigate to='/candidates' replace />
            ) : (
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            )
          }
        />

        <Route
          path='/signup'
          element={
            user ? (
              <Navigate to='/candidates' replace />
            ) : (
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            )
          }
        />

        <Route
          path='/forgot-password'
          element={
            user ? (
              <Navigate to='/candidates' replace />
            ) : (
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            )
          }
        />

        <Route
          path='/reset-password'
          element={
            user ? (
              <Navigate to='/candidates' replace />
            ) : (
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            )
          }
        />

        {/* PROTECTED ROUTES */}

        {/* All routes below require authentication */}

        {/* Upload - Resume uploads */}
        <Route
          path='/upload'
          element={
            <ProtectedRoute allowedRoles={UPLOAD_ROLES}>
              <UploadPage />
            </ProtectedRoute>
          }
        />

        {/* Candidates - Table and profile views */}
        <Route
          path='/candidates'
          element={
            <ProtectedRoute allowedRoles={CANDIDATE_ROLES}>
              <CandidateTablePage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/candidates/:id'
          element={
            <ProtectedRoute allowedRoles={CANDIDATE_ROLES}>
              <CandidateProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Jobs - Management and board */}
        <Route
          path='/jobs'
          element={
            <ProtectedRoute allowedRoles={JOB_ROLES}>
              <JobTablePage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/jobs/:jobId'
          element={
            <ProtectedRoute allowedRoles={JOB_ROLES}>
              <JobDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/job-board'
          element={
            <ProtectedRoute allowedRoles={JOB_ROLES}>
              <JobBoardPage />
            </ProtectedRoute>
          }
        />

        {/* Applications - Personal and admin views */}
        <Route
          path='/my-applications'
          element={
            <ProtectedRoute allowedRoles={APPLICATIONS_ROLES}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/applications'
          element={
            <ProtectedRoute allowedRoles={ADMIN_ROLES}>
              <AdminApplicationsPage />
            </ProtectedRoute>
          }
        />

        {/* Resumes */}
        <Route
          path='/my-resumes'
          element={
            <ProtectedRoute allowedRoles={CANDIDATE_ROLES}>
              <MyResumesPage />
            </ProtectedRoute>
          }
        />

        {/* Interviews */}
        <Route
          path='/interviews'
          element={
            <ProtectedRoute allowedRoles={INTERVIEWS_ROLES}>
              <InterviewsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/my-interviews'
          element={
            <ProtectedRoute allowedRoles={INTERVIEWS_ROLES}>
              <MyInterviewsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path='/candidate-interviews'
          element={
            <ProtectedRoute allowedRoles={INTERVIEWS_ROLES}>
              <CandidateInterviewsPage />
            </ProtectedRoute>
          }
        />

        {/* Analytics - Admin only */}
        <Route
          path='/analytics'
          element={
            <ProtectedRoute allowedRoles={ANALYTICS_ROLES}>
              <AnalyticsDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK ROUTE */}
        {/* invalid routes are redirected to signin */}
        <Route path='*' element={<Navigate to='/signin' replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
