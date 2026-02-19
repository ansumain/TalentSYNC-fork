import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import DashboardPage from './pages/Dashboard';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';

function App() {

  return (
    <Routes>
      <Route path='/signin' element={<LoginPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/reset-password' element={<ResetPasswordPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/dashboard' element={<DashboardPage />} />

      {/* Default Route */}
      <Route path='*' element={<Navigate to='/signin' replace/>} />
    </Routes>
  )

}

export default App
