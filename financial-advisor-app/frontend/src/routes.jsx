import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ReasonSelection from './pages/ReasonSelection/ReasonSelection'
import ProfessionalStatus from './pages/ProfessionalStatus/ProfessionalStatus'
import ProfileForm from './pages/ProfileForm/ProfileForm'
import Dashboard from './pages/Dashboard/Dashboard'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reason" element={<ReasonSelection />} />
      <Route path="/professional-status" element={<ProfessionalStatus />} />
      <Route path="/profile" element={<ProfileForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default AppRoutes