import { motion } from 'framer-motion'

export function MetricCard({ title, value, subtitle, color = 'sky', icon }) {
  const colorMap = {
    sky: 'from-sky-500/20 to-sky-600/10 border-sky-500/30',
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
  }

  const textColorMap = {
    sky: 'text-sky-400',
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    cyan: 'text-cyan-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-gradient-to-br p-5 ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className={`mt-2 text-2xl font-bold ${textColorMap[color]}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </motion.div>
  )
}
