import { HashRouter, Route, Routes } from 'react-router-dom'
import PasswordGate from './auth/PasswordGate'
import { PeopleProvider } from './context/PeopleContext'
import AppShell from './components/layout/AppShell'
import TreeBuilderPage from './components/tree/TreeBuilderPage'
import ResearchHubPage from './components/research/ResearchHubPage'
import Tree3DPage from './components/tree3d/Tree3DPage'
import './config/firebase'

export default function App() {
  return (
    <PasswordGate>
      <PeopleProvider>
        <HashRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<TreeBuilderPage />} />
              <Route path="/pessoa/:personId" element={<TreeBuilderPage />} />
              <Route path="/arvore-3d" element={<Tree3DPage />} />
              <Route path="/pesquisa" element={<ResearchHubPage />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </PeopleProvider>
    </PasswordGate>
  )
}
