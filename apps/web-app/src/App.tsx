import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './lib/checkRouteType/ProtectedRoute';
import { PublicRoute } from './lib/checkRouteType/PublicRoute';
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import DashboardPage from './pages/Dashboard';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';

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
        
        {/* Protected Routes - Require authentication */}
        <Route path='/dashboard' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        <Route path='*' element={<Navigate to='/signin' replace />} />
      </Routes>
    </>
  )

}

export default App
