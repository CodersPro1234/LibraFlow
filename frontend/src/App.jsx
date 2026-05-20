import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/shared/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import EtudiantFeed from './pages/etudiant/FeedPage'
import ProfesseurFeed from './pages/professeur/FeedPage'
import UniversiteDashboard from './pages/universite/DashboardPage'
import MinistereDashboard from './pages/ministere/DashboardPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Étudiant */}
        <Route element={<AppLayout title="Fil d'actualité" />}>
          <Route path="/etudiant/feed" element={<EtudiantFeed />} />
        </Route>

        {/* Professeur */}
        <Route element={<AppLayout title="Fil d'actualité" />}>
          <Route path="/professeur/feed" element={<ProfesseurFeed />} />
        </Route>

        {/* Université */}
        <Route element={<AppLayout title="Dashboard" />}>
          <Route path="/universite/dashboard" element={<UniversiteDashboard />} />
        </Route>

        {/* Ministère */}
        <Route element={<AppLayout title="Dashboard national" />}>
          <Route path="/ministere/dashboard" element={<MinistereDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App