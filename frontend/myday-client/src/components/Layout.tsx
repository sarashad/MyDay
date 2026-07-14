import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
  const { firstName, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* Navigation bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/dashboard" className="text-xl font-bold text-violet-600">
            🌟 MyDay
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard"
              className="text-gray-600 hover:text-violet-600 font-medium transition">
              Dashboard
            </Link>
            <Link to="/todos"
              className="text-gray-600 hover:text-violet-600 font-medium transition">
              Todos
            </Link>
            <Link to="/habits"
              className="text-gray-600 hover:text-violet-600 font-medium transition">
              Habits
            </Link>
            <Link to="/goals"
              className="text-gray-600 hover:text-violet-600 font-medium transition">
              Goals
            </Link>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              Hello, <span className="font-semibold text-violet-600">{firstName}</span>!
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              Logout
            </button>
          </div>

        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 overflow-hidden">
  <div className="px-6 py-4 h-full">
    <Outlet />
  </div>
</main>
    </div>
  )
}