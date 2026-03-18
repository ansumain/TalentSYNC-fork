import { lazy } from 'react';

export const useLazyPages = () => {
  // Lazy-loaded page components with automatic code splitting
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

  return {
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
  };
};
