import { HashRouter, Route, Routes } from 'react-router-dom'
import PasswordGate from './auth/PasswordGate'
import { PeopleProvider } from './context/PeopleContext'
import LandingHero from './components/landing/LandingHero'
import TreeCanvasPage from './components/treeview/TreeCanvasPage'
import ResearchPage from './components/research/ResearchPage'
import SimpleListPage from './components/simplelist/SimpleListPage'
import './config/firebase'

export default function App() {
  return (
    <PasswordGate>
      <PeopleProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingHero />} />
            <Route path="/arvore" element={<TreeCanvasPage />} />
            <Route path="/pesquisa" element={<ResearchPage />} />
            <Route path="/lista" element={<SimpleListPage />} />
          </Routes>
        </HashRouter>
      </PeopleProvider>
    </PasswordGate>
  )
}
