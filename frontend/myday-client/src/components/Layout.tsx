import { Outlet } from 'react-router-dom'

// Layout = the shell around all protected pages
// Outlet = where the page content goes
export default function Layout() {
  return (
    <div>
      <nav>Navigation will go here</nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}