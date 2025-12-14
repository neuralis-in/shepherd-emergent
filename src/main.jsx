import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Pricing from './pages/Pricing.jsx'
import Playground from './pages/Playground.jsx'
import Integrations from './pages/Integrations.jsx'
import ApiKeys from './pages/ApiKeys.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import Enterprise from './pages/Enterprise.jsx'
import IntraintelEnterprise from './pages/IntraintelEnterprise.jsx'
import PilotAgreement from './pages/PilotAgreement.jsx'
import Contact from './pages/Contact.jsx'
import Privacy from './pages/Privacy.jsx'
import Blog from './pages/Blog.jsx'
import PitchDeck from './pages/PitchDeck.jsx'
import ShepherdProgress from './pages/ShepherdProgress.jsx'
import VibehackDeck from './pages/VibehackDeck.jsx'
import Community from './pages/Community.jsx'

// ScrollToTop component - scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Use Vite's BASE_URL which is set from vite.config.js base option
const basename = import.meta.env.BASE_URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/api-keys" element={<ApiKeys />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/enterprise/intraintel.ai" element={<IntraintelEnterprise />} />
        <Route path="/enterprise/pilot/:enterpriseName" element={<PilotAgreement />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/*" element={<Blog />} />
        <Route path="/pitch-deck" element={<PitchDeck />} />
        <Route path="/pitch-deck/updates" element={<ShepherdProgress />} />
        <Route path="/vibehack" element={<VibehackDeck />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
