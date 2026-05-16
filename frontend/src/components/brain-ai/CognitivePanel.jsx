import { motion } from 'framer-motion'

export function CognitivePanel({ prediction: stats }) {
  if (!stats) return null

  const { skills, projects, experience, ai_ml, summary, success_rate } = stats

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-slate-300">Professional Overview</h3>

      <div className="space-y-3">
        <StatRow label="Core Skills" value={skills?.top} badge={skills?.count ? `${skills.count}+` : null} />
        <StatRow label="Projects" value={projects?.focus} badge={projects?.completed ? `${projects.completed} Completed` : null} />
        <StatRow label="Experience" value={experience?.level} badge={experience?.years ? `${experience.years} Yrs` : null} />
        <StatRow label="AI/ML Stats" value={ai_ml?.focus} badge={ai_ml?.models ? `${ai_ml.models} Models` : null} />
      </div>

      {summary && (
        <div className="mt-4 rounded-lg border border-sky-500/20 bg-sky-950/30 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-sky-400">Professional Summary</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{summary}</p>
        </div>
      )}

      {success_rate && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2">
          <span className="text-xs text-slate-400">Project Success Rate</span>
          <span className="text-sm font-bold text-emerald-400">{success_rate}%</span>
        </div>
      )}
    </motion.div>
  )
}

function StatRow({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-white">{value || '---'}</span>
        {badge && (
          <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-medium text-sky-400">
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}
