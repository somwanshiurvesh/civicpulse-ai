import { useState, useEffect } from 'react'
import ReportWizard from './components/wizard/ReportWizard'

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...')
  const [aiStatus, setAiStatus] = useState('Checking...')

  useEffect(() => {
    // Health check requests to verify services integration
    fetch('http://localhost:5000/health')
      .then(res => res.json())
      .then(data => setServerStatus(data.success ? 'Connected' : 'Error'))
      .catch(() => setServerStatus('Disconnected'))

    fetch('http://localhost:5001/health')
      .then(res => res.json())
      .then(data => setAiStatus(data.success ? 'Connected' : 'Error'))
      .catch(() => setAiStatus('Disconnected'))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-teal-500/20">
              CP
            </div>
            <div>
              <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                CivicPulse AI
              </span>
              <span className="text-xs block text-slate-400 font-medium">Issue Reporting Module</span>
            </div>
          </div>
          <nav className="flex gap-6 items-center">
            <span className="text-xs px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
              Day 6 Wizard Active
            </span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col gap-12">
        {/* Hero Section */}
        <section className="text-center py-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 bg-gradient-to-b from-slate-100 to-slate-300">
            Empowering Communities with <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">AI-Driven Reporting</span>
          </h1>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Turning real-world observations into structured, geolocated, and evidence-backed digital records for downstream routing.
          </p>
        </section>

        {/* Day 6 Citizen Reporting Wizard Section */}
        <section className="w-full">
          <ReportWizard />
        </section>

        {/* Status Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Node.js Core API Gateway Status */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Core API Layer</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  serverStatus === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  serverStatus === 'Checking...' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    serverStatus === 'Connected' ? 'bg-emerald-400 animate-pulse' : 
                    serverStatus === 'Checking...' ? 'bg-amber-400 animate-pulse' :
                    'bg-rose-400'
                  }`} />
                  {serverStatus}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Node.js + Express</h3>
              <p className="text-slate-400 text-sm">
                Primary API gateway & orchestrator. Handles schema validation, JWT auth, database persistence, and AI job handoff.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs text-slate-500 flex justify-between">
              <span>Port: 5000</span>
              <span>Endpoint: /health</span>
            </div>
          </div>

          {/* Python AI Worker Status */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">AI Worker Service</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  aiStatus === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  aiStatus === 'Checking...' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    aiStatus === 'Connected' ? 'bg-emerald-400 animate-pulse' : 
                    aiStatus === 'Checking...' ? 'bg-amber-400 animate-pulse' :
                    'bg-rose-400'
                  }`} />
                  {aiStatus}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Python AI / ML</h3>
              <p className="text-slate-400 text-sm">
                Downstream worker handling image analysis, classification, and confidence scoring. Never called directly by front-end.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs text-slate-500 flex justify-between">
              <span>Port: 5001</span>
              <span>Endpoint: /health</span>
            </div>
          </div>

          {/* Database & Spatial Engine */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Primary Datastore</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-500/10 text-blue-400 border-blue-500/20">
                  PostGIS Enabled
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">PostgreSQL + PostGIS</h3>
              <p className="text-slate-400 text-sm">
                Relational database housing normalized schemas. Powers spatial queries, duplicate detection radius searches, and geo-data.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs text-slate-500 flex justify-between">
              <span>Port: 5432</span>
              <span>SRID: 4326</span>
            </div>
          </div>
        </section>

        {/* Integration Plan Callout */}
        <section className="p-8 rounded-2xl bg-gradient-to-r from-teal-950/40 to-slate-900/50 border border-teal-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-2xl">
            <h4 className="text-lg font-bold text-teal-400 mb-1">Architecture and Integration Standards Alignment</h4>
            <p className="text-sm text-slate-400">
              The project is structured strictly as a monorepo containing decoupled concerns. Verify shared contracts, endpoints, and database layout in the `/docs` directory.
            </p>
          </div>
          <a
            href="https://github.com/somwanshiurvesh/civicpulse-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-sm font-semibold"
          >
            Explore Docs
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© 2026 CivicPulse AI. Developed under module ownership standards.</p>
      </footer>
    </div>
  )
}

export default App
