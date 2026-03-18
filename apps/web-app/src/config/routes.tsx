import { lazy, type ReactNode } from 'react';

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

export interface RouteConfig {
    path: string;
    element: ReactNode;
    isPublic: boolean;
    description?: string;
}

export const appRoutes: RouteConfig[] = [
    {
        path: '/signin',
        element: <LoginPage />,
        isPublic: true,
        description: 'User login page',
    },
    {
        path: '/signup',
        element: <SignupPage />,
        isPublic: true,
        description: 'User registration page',
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
        isPublic: true,
        description: 'Forgot password page',
    },
    {
        path: '/reset-password',
        element: <ResetPasswordPage />,
        isPublic: true,
        description: 'Reset password with OTP',
    },

    {
        path: '/upload',
        element: <UploadPage />,
        isPublic: false,
        description: 'Resume upload page',
    },
    {
        path: '/candidates',
        element: <CandidateTablePage />,
        isPublic: false,
        description: 'Candidate list/table view',
    },
    {
        path: '/candidates/:id',
        element: <CandidateProfilePage />,
        isPublic: false,
        description: 'Individual candidate profile',
    },
    {
        path: '/jobs',
        element: <JobTablePage />,
        isPublic: false,
        description: 'Jobs management view',
    },
    {
        path: '/jobs/:jobId',
        element: <JobDetailPage />,
        isPublic: false,
        description: 'Job details page',
    },
    {
        path: '/job-board',
        element: <JobBoardPage />,
        isPublic: false,
        description: 'Public job board for candidates',
    },
    {
        path: '/my-applications',
        element: <ApplicationsPage />,
        isPublic: false,
        description: 'Candidate\'s job applications',
    },
    {
        path: '/my-resumes',
        element: <MyResumesPage />,
        isPublic: false,
        description: 'Candidate\'s resume management',
    },
    {
        path: '/applications',
        element: <AdminApplicationsPage />,
        isPublic: false,
        description: 'Admin view of all applications',
    },
    {
        path: '/interviews',
        element: <InterviewsPage />,
        isPublic: false,
        description: 'Interviews for candidates',
    },
    {
        path: '/my-interviews',
        element: <MyInterviewsPage />,
        isPublic: false,
        description: 'Candidate\'s scheduled interviews',
    },
    {
        path: '/candidate-interviews',
        element: <CandidateInterviewsPage />,
        isPublic: false,
        description: 'Candidate interviews view',
    },
    {
        path: '/analytics',
        element: <AnalyticsDashboardPage />,
        isPublic: false,
        description: 'Analytics dashboard (admin view)',
    },
];