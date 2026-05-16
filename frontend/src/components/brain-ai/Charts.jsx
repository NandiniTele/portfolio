import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts'
import { motion } from 'framer-motion'

export function BrainwaveChart({ signalData, title = 'Neural Signal' }) {
  if (!signalData || signalData.length === 0) return null

  const data = signalData.map((val, idx) => ({ t: idx, value: val }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-300">{title}</h3>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="t" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#38bdf8' }}
          />
          <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="url(#signalGradient)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function MultiBandChart({ bands }) {
  if (!bands) return null

  const colors = {
    alpha: '#a78bfa',
    beta: '#38bdf8',
    gamma: '#f472b6',
    theta: '#34d399',
  }

  // Combine all bands into chart data
  const maxLen = Math.max(
    ...[bands.alpha, bands.beta, bands.gamma, bands.theta]
      .filter(Boolean)
      .map((b) => b.length)
  )
  const data = Array.from({ length: Math.min(maxLen, 64) }, (_, idx) => ({
    t: idx,
    alpha: bands.alpha?.[idx] ?? 0,
    beta: bands.beta?.[idx] ?? 0,
    gamma: bands.gamma?.[idx] ?? 0,
    theta: bands.theta?.[idx] ?? 0,
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-300">Multi-Band Brainwave Activity</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="t" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line type="monotone" dataKey="alpha" stroke={colors.alpha} strokeWidth={1.5} dot={false} name="Alpha" />
          <Line type="monotone" dataKey="beta" stroke={colors.beta} strokeWidth={1.5} dot={false} name="Beta" />
          <Line type="monotone" dataKey="gamma" stroke={colors.gamma} strokeWidth={1.5} dot={false} name="Gamma" />
          <Line type="monotone" dataKey="theta" stroke={colors.theta} strokeWidth={1.5} dot={false} name="Theta" />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-3">
        {Object.entries(colors).map(([band, color]) => (
          <div key={band} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs capitalize text-slate-400">{band}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function AccuracyTrendChart({ data }) {
  if (!data || data.length === 0) return null

  const chartData = data.map((val, idx) => ({ step: idx + 1, accuracy: val }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/10 bg-slate-900/50 p-4"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-300">Prediction Accuracy Trend</h3>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="step" hide />
          <YAxis domain={[70, 100]} hide />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(val) => [`${val}%`, 'Accuracy']}
          />
          <Area type="monotone" dataKey="accuracy" stroke="#34d399" fill="url(#accuracyGradient)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
