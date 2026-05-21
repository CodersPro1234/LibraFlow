import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/shared/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import EtudiantFeed from './pages/etudiant/FeedPage'
import ProfesseurFeed from './pages/professeur/FeedPage'
import PublishPage from './pages/professeur/PublishPage'
import BiblioPage from './pages/etudiant/BiblioPage'
import NotificationsPage from './pages/etudiant/NotificationsPage'
import EtudiantUniversitesPage from './pages/etudiant/UniversitesPage'
import UniversiteDashboard from './pages/universite/DashboardPage'
import ProfsPage from './pages/universite/ProfsPage'
import EtudiantsPage from './pages/universite/EtudiantsPage'
import PublicationsPage from './pages/universite/PublicationsPage'
import MinistereDashboard from './pages/ministere/DashboardPage'
import UniversitesPage from './pages/ministere/UniversitesPage'
import SignalesPage from './pages/ministere/SignalesPage'
import CartePage from './pages/ministere/CartePage'
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
        <Route element={<AppLayout title="Ma bibliothèque" />}>
          <Route path="/etudiant/bibliotheque" element={<BiblioPage />} />
        </Route>
        <Route element={<AppLayout title="Notifications" />}>
          <Route path="/etudiant/notifications" element={<NotificationsPage />} />
        </Route>
        <Route element={<AppLayout title="Universités" />}>
          <Route path="/etudiant/universites" element={<EtudiantUniversitesPage />} />
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
        <Route element={<AppLayout title="Professeurs" />}>
          <Route path="/universite/professeurs" element={<ProfsPage />} />
        </Route>
        <Route element={<AppLayout title="Étudiants" />}>
          <Route path="/universite/etudiants" element={<EtudiantsPage />} />
        </Route>
        <Route element={<AppLayout title="Publications" />}>
          <Route path="/universite/publications" element={<PublicationsPage />} />
        </Route>

        {/* Ministère */}
        <Route element={<AppLayout title="Dashboard national" />}>
          <Route path="/ministere/dashboard" element={<MinistereDashboard />} />
        </Route>
        <Route element={<AppLayout title="Universités" />}>
          <Route path="/ministere/universites" element={<UniversitesPage />} />
        </Route>
        <Route element={<AppLayout title="Signalements" />}>
          <Route path="/ministere/signales" element={<SignalesPage />} />
        </Route>
        <Route element={<AppLayout title="Carte nationale" />}>
          <Route path="/ministere/carte" element={<CartePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App