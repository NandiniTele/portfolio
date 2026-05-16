import { useCallback, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { fetchPortfolio } from './lib/api'
import { LoadingScreen } from './components/LoadingScreen'
import { HomePage } from './pages/HomePage'
import { BrainAIDashboard } from './pages/BrainAIDashboard'

function ErrorPanel({ message, onRetry }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-lg rounded-3xl p-8 text-center"
      >
        <p className="font-display text-xl font-semibold text-white">Could not load portfolio</p>
        <p className="mt-3 text-sm text-slate-400">{message}</p>
        <p className="mt-4 text-xs text-slate-500">
          Start the API from the <code className="text-sky-300">backend</code> folder on{' '}
          <strong className="text-slate-300">port 8001</strong> (matches Vite proxy), then retry.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-slate-900/80 p-3 text-left text-[11px] leading-relaxed text-slate-400">
          {`cd backend
.\\.venv\\Scripts\\activate
uvicorn main:app --reload --host 127.0.0.1 --port 8001`}
        </pre>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
        >
          Retry
        </button>
      </motion.div>
    </div>
  )
}

function PortfolioPage() {
  const [phase, setPhase] = useState('loading')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setPhase('loading')
    setError('')
    const minDelay = new Promise((r) => setTimeout(r, 1000))
    try {
      const [payload] = await Promise.all([fetchPortfolio(), minDelay])
      setData(payload)
      const title = payload?.meta?.site_title
      if (title) document.title = title
      setPhase('ready')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setPhase('error')
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      void load()
    })
  }, [load])

  return (
    <>
      <AnimatePresence>
        {phase === 'loading' && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {phase === 'ready' && data ? <HomePage data={data} /> : null}
      {phase === 'error' ? <ErrorPanel message={error} onRetry={load} /> : null}
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/brain-ai" element={<BrainAIDashboard />} />
    </Routes>
  )
}
