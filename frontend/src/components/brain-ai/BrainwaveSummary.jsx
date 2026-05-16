import { motion } from 'framer-motion'

const strengthTextColors = {
  Strong: 'text-emerald-400',
  Medium: 'text-amber-400',
  Low: 'text-slate-500',
}

export function BrainwaveSummary({ summary, powers }) {
  if (!summary) return null

  const bands = [
    { name: 'Alpha', key: 'alpha', desc: '8-13 Hz (Relaxation)', color: '#a78bfa' },
    { name: 'Beta', key: 'beta', desc: '13-30 Hz (Active)', color: '#38bdf8' },
    { name: 'Gamma', key: 'gamma', desc: '30-50 Hz (Cognition)', color: '#f472b6' },
    { name: 'Theta', key: 'theta', desc: '4-8 Hz (Meditation)', color: '#34d399' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-slate-300">Brainwave Summary</h3>
      <div className="space-y-3">
        {bands.map((band) => {
          const strength = summary[band.key] || 'Low'
          const power = powers?.[band.key] || 0
          const maxPower = Math.max(...Object.values(powers || {}), 0.001)
          const barWidth = Math.min((power / maxPower) * 100, 100)

          return (
            <div key={band.key}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: band.color }} />
                  <span className="text-xs font-medium text-slate-300">{band.name}</span>
                  <span className="text-[10px] text-slate-600">{band.desc}</span>
                </div>
                <span className={`text-xs font-semibold ${strengthTextColors[strength]}`}>{strength}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: band.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
