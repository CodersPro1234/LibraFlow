import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import EtudiantFeed from './pages/etudiant/FeedPage'
import ProfesseurFeed from './pages/professeur/FeedPage'
import UniversiteDashboard from './pages/universite/DashboardPage'
import MinistereDashboard from './pages/ministere/DashboardPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/etudiant/feed" element={<EtudiantFeed />} />
        <Route path="/professeur/feed" element={<ProfesseurFeed />} />
        <Route path="/universite/dashboard" element={<UniversiteDashboard />} />
        <Route path="/ministere/dashboard" element={<MinistereDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App