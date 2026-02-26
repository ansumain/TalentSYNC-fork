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

function App() {

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Routes>
        {/* Public Routes - Redirect to dashboard if already logged in */}
        <Route path='/signin' element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path='/forgot-password' element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path='/reset-password' element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        <Route path='/signup' element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path='/upload' element={<PublicRoute><UploadPage /></PublicRoute>} />        

        <Route path='/table' element={<CandidateTablePage />} />        
        
        {/* Protected Routes - Require authentication */}
        <Route path='/home' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

        <Route path='*' element={<Navigate to='/signin' replace />} />
      </Routes>
    </>
  )

}

export default App
