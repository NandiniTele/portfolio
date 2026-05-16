import { motion } from 'framer-motion'

export function SystemStatus({ stats }) {
  if (!stats) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">System Status</h3>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[10px] font-medium text-emerald-400">ONLINE</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatusItem label="Architecture" value={stats.model_info?.architecture || 'CNN-LSTM'} />
        <StatusItem label="Total Users" value={stats.learning_stats?.total_users || 0} />
        <StatusItem label="Predictions" value={stats.learning_stats?.total_predictions || 0} />
        <StatusItem label="Adaptation" value={`${((stats.learning_stats?.average_adaptation_level || 0) * 100).toFixed(0)}%`} />
        <StatusItem label="Buffer Size" value={stats.learning_stats?.experience_buffer_size || 0} />
        <StatusItem label="Global Acc." value={`${stats.learning_stats?.global_accuracy || 85}%`} />
      </div>

      {stats.available_states && (
        <div className="mt-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Available States</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {stats.available_states.map((state) => (
              <span key={state} className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                {state}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function StatusItem({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-800/50 px-3 py-2">
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-xs font-semibold text-white">{value}</p>
    </div>
  )
}
