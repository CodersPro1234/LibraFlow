import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Outlet } from 'react-router-dom'

const AppLayout = ({ title }) => {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Topbar */}
        <Topbar title={title} />

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AppLayout