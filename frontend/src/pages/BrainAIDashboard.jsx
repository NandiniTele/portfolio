import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MetricCard } from '../components/brain-ai/MetricCard'
import { BrainwaveChart, MultiBandChart, AccuracyTrendChart } from '../components/brain-ai/Charts'
import { BrainwaveSummary } from '../components/brain-ai/BrainwaveSummary'
import { CognitivePanel } from '../components/brain-ai/CognitivePanel'
import { SystemStatus } from '../components/brain-ai/SystemStatus'
import { fetchSnapshot, fetchBrainAIStatus, analyzeSignal } from '../lib/brainAiApi'

export function BrainAIDashboard() {
  const [snapshot, setSnapshot] = useState(null)
  const [systemStats, setSystemStats] = useState(null)
  const [fullAnalysis, setFullAnalysis] = useState(null)
  const [accuracyHistory, setAccuracyHistory] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const [selectedState, setSelectedState] = useState('')
  const intervalRef = useRef(null)

  const loadInitialData = useCallback(async () => {
    try {
      const [stats, snap] = await Promise.all([fetchBrainAIStatus(), fetchSnapshot()])
      setSystemStats(stats)
      setSnapshot(snap)
      setAccuracyHistory((prev) => [...prev, snap.prediction_accuracy].slice(-30))
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchBrainAIStatus()
      .then((stats) => { if (!cancelled) setSystemStats(stats) })
      .catch(() => {})
    fetchSnapshot()
      .then((snap) => {
        if (!cancelled) {
          setSnapshot(snap)
          setAccuracyHistory((prev) => [...prev, snap.prediction_accuracy].slice(-30))
        }
      })
      .catch((e) => { if (!cancelled) setError(e.message) })
    return () => { cancelled = true }
  }, [])

  const startStreaming = useCallback(() => {
    setIsStreaming(true)
    intervalRef.current = setInterval(async () => {
      try {
        const snap = await fetchSnapshot()
        setSnapshot(snap)
        setAccuracyHistory((prev) => [...prev, snap.prediction_accuracy].slice(-30))
        setError(null)
      } catch (e) {
        setError(e.message)
      }
    }, 2000)
  }, [])

  const stopStreaming = useCallback(() => {
    setIsStreaming(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const runFullAnalysis = useCallback(async () => {
    try {
      const result = await analyzeSignal(selectedState || null)
      setFullAnalysis(result)
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }, [selectedState])

  const states = systemStats?.available_states || [
    'focused', 'relaxed', 'stressed', 'meditative', 'fatigued', 'alert', 'creative',
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a8 8 0 0 1 8 8c0 3-1.5 5.5-4 7v3H8v-3c-2.5-1.5-4-4-4-7a8 8 0 0 1 8-8z" />
                <path d="M10 22h4" />
                <path d="M9 9h.01M15 9h.01" />
                <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Brain-AI Hybrid Interface</h1>
              <p className="text-[10px] text-slate-500">Thought Pattern Decoder v1.0</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={isStreaming ? stopStreaming : startStreaming}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                isStreaming
                  ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              }`}
            >
              {isStreaming ? 'Stop Streaming' : 'Start Real-time'}
            </button>
            <a
              href="/"
              className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-400 transition hover:bg-slate-700 hover:text-white"
            >
              Portfolio
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-400"
          >
            {error} - Ensure backend is running on port 8001
          </motion.div>
        )}

        {/* Top Metrics Row */}
        <AnimatePresence mode="wait">
          {snapshot && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            >
              <MetricCard title="Emotion" value={snapshot.emotion} subtitle={`${(snapshot.emotion_confidence * 100).toFixed(0)}% conf.`} color="violet" />
              <MetricCard title="Focus" value={`${snapshot.focus_level?.toFixed(0)}%`} color="sky" />
              <MetricCard title="Stress" value={snapshot.stress_category} subtitle={`${snapshot.stress_level?.toFixed(0)}%`} color="rose" />
              <MetricCard title="Attention" value={`${snapshot.attention_score?.toFixed(0)}%`} color="amber" />
              <MetricCard title="Fatigue" value={snapshot.fatigue_status} subtitle={`${snapshot.fatigue_level?.toFixed(0)}%`} color="cyan" />
              <MetricCard title="State" value={snapshot.cognitive_state} color="emerald" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Charts and Analysis Grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Left Column - Charts */}
          <div className="space-y-4 lg:col-span-2">
            {snapshot?.signal_preview && (
              <BrainwaveChart signalData={snapshot.signal_preview} title="Real-time Neural Signal (Preprocessed)" />
            )}

            {fullAnalysis?.signal_data && (
              <MultiBandChart bands={fullAnalysis.signal_data} />
            )}

            <AccuracyTrendChart data={accuracyHistory} />

            {/* Control Panel */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-300">Neural Simulation Control</h3>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
                >
                  <option value="">Random State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <button
                  onClick={runFullAnalysis}
                  className="rounded-lg bg-gradient-to-r from-sky-500 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
                >
                  Run Full Analysis
                </button>
                <button
                  onClick={loadInitialData}
                  className="rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-xs text-slate-300 transition hover:bg-slate-700"
                >
                  Refresh
                </button>
              </div>
              {fullAnalysis && (
                <p className="mt-2 text-[10px] text-slate-500">
                  Processed in {fullAnalysis.processing_time_ms}ms | Simulated: {fullAnalysis.signal_info?.simulated_state}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Panels */}
          <div className="space-y-4">
            {snapshot?.brainwave_summary && (
              <BrainwaveSummary summary={snapshot.brainwave_summary} powers={snapshot.band_powers} />
            )}

            {fullAnalysis?.cognitive_prediction && (
              <CognitivePanel prediction={fullAnalysis.cognitive_prediction} />
            )}

            {!fullAnalysis && snapshot && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"
              >
                <h3 className="mb-3 text-sm font-semibold text-slate-300">Quick Analysis</h3>
                <div className="space-y-2">
                  <QuickRow label="Behavioral Intent" value={snapshot.behavioral_intent} />
                  <QuickRow label="AI Interpretation" value={snapshot.ai_interpretation} />
                  <QuickRow label="Accuracy" value={`${snapshot.prediction_accuracy}%`} />
                </div>
              </motion.div>
            )}

            <SystemStatus stats={systemStats} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/5 py-6 text-center">
        <p className="text-xs text-slate-600">
          Brain-AI Hybrid Interface Simulator | Thought Pattern Decoder | CNN-LSTM Cognitive Architecture
        </p>
      </footer>
    </div>
  )
}

function QuickRow({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-800/50 px-3 py-2">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-xs text-slate-300">{value || '---'}</p>
    </div>
  )
}
