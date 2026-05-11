import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // Added for better UX, I'll add to package.json
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CreateDesk from './pages/CreateDesk'
import Exam from './pages/Exam'
import Results from './pages/Results'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-desk" element={<CreateDesk />} />
        <Route path="/exam/:id" element={<Exam />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
