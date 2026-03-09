
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './lib/checkRouteType/ProtectedRoute';
import { PublicRoute } from './lib/checkRouteType/PublicRoute';
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import HomePage from './pages/Home';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import UploadPage from './pages/Upload';
import CandidateTablePage from './pages/CandidateTablePage';
import CandidateProfilePage from './pages/CandidateProfilePage';
import { GetAccessTokenFromRefreshTokenInterval } from './lib/api/getAccessToken';
import JobTablePage from './pages/JobTablePage';
import JobDetailPage from './pages/JobDetailPage';
import JobBoardPage from './pages/JobBoardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import AdminApplicationsPage from './pages/AdminApplicationsPage';
import MyResumesPage from './pages/MyResumesPage';


function App() {
  GetAccessTokenFromRefreshTokenInterval();

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        {/* Public Routes - Redirect to dashboard if already logged in */}
        <Route path='/signin' element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path='/forgot-password' element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path='/reset-password' element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        <Route path='/signup' element={<PublicRoute><SignupPage /></PublicRoute>} />

        {/* Protected Routes - Require authentication */}
        <Route path='/home' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path='/upload' element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path='/candidates' element={<ProtectedRoute><CandidateTablePage /></ ProtectedRoute>} />
        <Route path='/candidates/:id' element={<ProtectedRoute><CandidateProfilePage /></ ProtectedRoute>} />
        <Route path='/jobs' element={<ProtectedRoute><JobTablePage /></ProtectedRoute>} />
        <Route path='/jobs/:jobId' element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
        <Route path='/job-board' element={<ProtectedRoute><JobBoardPage /></ProtectedRoute>} />
        <Route path='/my-applications' element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
        <Route path='/my-resumes' element={<ProtectedRoute><MyResumesPage /></ProtectedRoute>} />
        <Route path='/applications' element={<ProtectedRoute><AdminApplicationsPage /></ProtectedRoute>} />

        <Route path='*' element={<Navigate to='/signin' replace />} />
      </Routes>
    </>
  )
}

export default App
