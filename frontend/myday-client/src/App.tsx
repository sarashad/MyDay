import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TodosPage from './pages/TodosPage'
import HabitsPage from './pages/HabitsPage'
import GoalsPage from './pages/GoalsPage'
import Layout from './components/Layout'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      {/* Public routes - only for non-logged in users */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
      } />

      {/* Protected routes - only for logged in users */}
      <Route path="/" element={
        isAuthenticated ? <Layout /> : <Navigate to="/login" />
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="todos" element={<TodosPage />} />
        <Route path="habits" element={<HabitsPage />} />
        <Route path="goals" element={<GoalsPage />} />
      </Route>
    </Routes>
  )
}

export default App