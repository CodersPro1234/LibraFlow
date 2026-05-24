import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { Outlet } from 'react-router-dom'

const AppLayout = ({ title }) => {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto" style={{ padding: '28px 40px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
