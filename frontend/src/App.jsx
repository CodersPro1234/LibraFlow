import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/shared/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import EtudiantFeed from './pages/etudiant/FeedPage'
import ProfesseurFeed from './pages/professeur/FeedPage'
import PublishPage from './pages/professeur/PublishPage'
import UniversiteDashboard from './pages/universite/DashboardPage'
import MinistereDashboard from './pages/ministere/DashboardPage'
import MesPublicationsPage from './pages/professeur/MesPublicationsPage'
import CommunautePage from './pages/professeur/CommunautePage'
import SearchPage from './pages/etudiant/SearchPage'

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
        <Route element={<AppLayout title="Recherche" />}>
  <Route path="/etudiant/search" element={<SearchPage />} />
</Route>

        {/* Professeur */}
        <Route element={<AppLayout title="Fil d'actualité" />}>
          <Route path="/professeur/feed" element={<ProfesseurFeed />} />
        </Route>
        <Route element={<AppLayout title="Publier un document" />}>
          <Route path="/professeur/publier" element={<PublishPage />} />
        </Route>
        <Route element={<AppLayout title="Mes publications" />}>
 <Route path="/professeur/publications" element={<MesPublicationsPage />} />
</Route>
<Route element={<AppLayout title="Ma communauté" />}>
  <Route path="/professeur/communaute" element={<CommunautePage />} />
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