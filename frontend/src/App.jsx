import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/shared/AppLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import EtudiantFeed from './pages/etudiant/FeedPage'
import ProfesseurFeed from './pages/professeur/FeedPage'
import PublishPage from './pages/professeur/PublishPage'
import InscriptionPage from './pages/auth/InscriptionPage'
import InscriptionProfesseurPage from './pages/auth/InscriptionProfesseurPage'
import InscriptionUniversitePage from './pages/auth/InscriptionUniversitePage'
import BiblioPage from './pages/etudiant/BiblioPage'
import NotificationsPage from './pages/etudiant/NotificationsPage'
import EtudiantUniversitesPage from './pages/etudiant/UniversitesPage'
import LecturePage from './pages/etudiant/LecturePage'
import ProfilPage from './pages/etudiant/ProfilPage'
import ProfesseurProfilPage from './pages/etudiant/ProfesseurProfilPage'
import UniversiteDashboard from './pages/universite/DashboardPage'
import ProfsPage from './pages/universite/ProfsPage'
import EtudiantsPage from './pages/universite/EtudiantsPage'
import PublicationsPage from './pages/universite/PublicationsPage'
import UniversiteProfilPage from './pages/universite/ProfilPage'
import UniversiteNotificationsPage from './pages/universite/NotificationsPage'
import MinistereDashboard from './pages/ministere/DashboardPage'
import UniversitesPage from './pages/ministere/UniversitesPage'
import SignalesPage from './pages/ministere/SignalesPage'
import CartePage from './pages/ministere/CartePage'
import StatistiquesPage from './pages/ministere/StatistiquesPage'
import MinistereProfilPage from './pages/ministere/ProfilPage'
import MinistereNotificationsPage from './pages/ministere/NotificationsPage'
import ValidationPage from './pages/ministere/ValidationPage'
import MesPublicationsPage from './pages/professeur/MesPublicationsPage'
import CommunautePage from './pages/professeur/CommunautePage'
import ProfesseurProfilPage2 from './pages/professeur/ProfilPage'
import ProfesseurNotificationsPage from './pages/professeur/NotificationsPage'
import SearchPage from './pages/etudiant/SearchPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/inscription/professeur" element={<InscriptionProfesseurPage />} />
        <Route path="/inscription/universite" element={<InscriptionUniversitePage />} />

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
        <Route element={<AppLayout title="Lecture" />}>
          <Route path="/etudiant/lecture/:id" element={<LecturePage />} />
        </Route>
        <Route element={<AppLayout title="Mon profil" />}>
          <Route path="/etudiant/profil" element={<ProfilPage />} />
        </Route>
        <Route element={<AppLayout title="Profil professeur" />}>
          <Route path="/etudiant/professeur/:id" element={<ProfesseurProfilPage />} />
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
        <Route element={<AppLayout title="Mon profil" />}>
          <Route path="/professeur/profil" element={<ProfesseurProfilPage2 />} />
        </Route>
        <Route element={<AppLayout title="Notifications" />}>
          <Route path="/professeur/notifications" element={<ProfesseurNotificationsPage />} />
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
        <Route element={<AppLayout title="Mon profil" />}>
          <Route path="/universite/profil" element={<UniversiteProfilPage />} />
        </Route>
        <Route element={<AppLayout title="Notifications" />}>
          <Route path="/universite/notifications" element={<UniversiteNotificationsPage />} />
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
        <Route element={<AppLayout title="Statistiques nationales" />}>
          <Route path="/ministere/statistiques" element={<StatistiquesPage />} />
        </Route>
        <Route element={<AppLayout title="Validations" />}>
          <Route path="/ministere/validations" element={<ValidationPage />} />
        </Route>
        <Route element={<AppLayout title="Mon profil" />}>
          <Route path="/ministere/profil" element={<MinistereProfilPage />} />
        </Route>
        <Route element={<AppLayout title="Notifications" />}>
          <Route path="/ministere/notifications" element={<MinistereNotificationsPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
