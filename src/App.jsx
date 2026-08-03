import { HashRouter, Route, Routes } from 'react-router-dom'
import PasswordGate from './auth/PasswordGate'
import { PeopleProvider } from './context/PeopleContext'
import AppShell from './components/layout/AppShell'
import TreeBuilderPage from './components/tree/TreeBuilderPage'
import ResearchHubPage from './components/research/ResearchHubPage'
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
              <Route path="/pesquisa" element={<ResearchHubPage />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </PeopleProvider>
    </PasswordGate>
  )
}
