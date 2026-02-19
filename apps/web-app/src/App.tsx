import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'

function App() {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />

      {/* Default Route */}
      <Route path='*' element={<Navigate to='/login' replace/>} />
    </Routes>
  )

}

export default App
