// App Routes Component

import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ProtectedRoute } from '../lib/checkRouteType/ProtectedRoute';
import { PublicRoute } from '../lib/checkRouteType/PublicRoute';
import { RouteLoader } from '../components/RouteLoader';
import { RouteErrorBoundary } from '../components/RouteErrorBoundary';
import { getDefaultRouteForRoles } from '../lib/auth/defaultRoute';
import {
  ADMIN_APPLICATIONS_ROLES,
  ANALYTICS_ROLES,
  APPLICATIONS_ROLES,
  CANDIDATE_ROLES,
  INTERVIEWS_MANAGEMENT_ROLES,
  MY_INTERVIEWS_ROLES,
  CANDIDATE_INTERVIEWS_ROLES,
  JOB_BOARD_ROLES,
  JOB_MANAGEMENT_ROLES,
  MY_RESUMES_ROLES,
  UPLOAD_ROLES,
} from '../constants/roles.constants';

const LoginPage = lazy(() => import('../pages/Login'));
const SignupPage = lazy(() => import('../pages/Signup'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPassword'));
const UploadPage = lazy(() => import('../pages/Upload'));
const CandidateTablePage = lazy(() => import('../pages/CandidateTablePage'));
const CandidateProfilePage = lazy(() => import('../pages/CandidateProfilePage'));
const JobTablePage = lazy(() => import('../pages/JobTablePage'));
const JobDetailPage = lazy(() => import('../pages/JobDetailPage'));
const JobBoardPage = lazy(() => import('../pages/JobBoardPage'));
const ApplicationsPage = lazy(() => import('../pages/ApplicationsPage'));
const AdminApplicationsPage = lazy(() => import('../pages/AdminApplicationsPage'));
const MyResumesPage = lazy(() => import('../pages/MyResumesPage'));
const InterviewsPage = lazy(() => import('../pages/InterviewsPage'));
const MyInterviewsPage = lazy(() => import('../pages/MyInterviewsPage'));
const CandidateInterviewsPage = lazy(() => import('../pages/CandidateInterviewsPage'));
const AnalyticsDashboardPage = lazy(() => import('../pages/AnalyticsDashboardPage'));

function AppRoutes() {
  const user = useAuthStore((state: { user: { roles: string[] } | null }) => state.user);
  const homeRedirectPath = getDefaultRouteForRoles(user?.roles);

  return (
    <RouteErrorBoundary>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          {/* Root redirect based on auth state */}
          <Route
            path='/'
            element={
              user ? (
                <Navigate to={homeRedirectPath} replace />
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
                <Navigate to={homeRedirectPath} replace />
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
                <Navigate to={homeRedirectPath} replace />
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
                <Navigate to={homeRedirectPath} replace />
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
                <Navigate to={homeRedirectPath} replace />
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
              <ProtectedRoute allowedRoles={JOB_MANAGEMENT_ROLES}>
                <JobTablePage />
              </ProtectedRoute>
            }
          />

          <Route
            path='/jobs/:jobId'
            element={
              <ProtectedRoute allowedRoles={JOB_MANAGEMENT_ROLES}>
                <JobDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path='/job-board'
            element={
              <ProtectedRoute allowedRoles={JOB_BOARD_ROLES}>
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
              <ProtectedRoute allowedRoles={ADMIN_APPLICATIONS_ROLES}>
                <AdminApplicationsPage />
              </ProtectedRoute>
            }
          />

          {/* Resumes */}
          <Route
            path='/my-resumes'
            element={
              <ProtectedRoute allowedRoles={MY_RESUMES_ROLES}>
                <MyResumesPage />
              </ProtectedRoute>
            }
          />

          {/* Interviews */}
          <Route
            path='/interviews'
            element={
              <ProtectedRoute allowedRoles={INTERVIEWS_MANAGEMENT_ROLES}>
                <InterviewsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path='/my-interviews'
            element={
              <ProtectedRoute allowedRoles={MY_INTERVIEWS_ROLES}>
                <MyInterviewsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path='/candidate-interviews'
            element={
              <ProtectedRoute allowedRoles={CANDIDATE_INTERVIEWS_ROLES}>
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
          {/* invalid routes are redirected to signin - add page-not-found Page*/}
          <Route path='*' element={<Navigate to='/signin' replace />} />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
}

export default AppRoutes;
