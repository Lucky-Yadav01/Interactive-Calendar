import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="app-main">
        <Navbar onMenuToggle={() => setIsSidebarOpen((previous) => !previous)} />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
