import { motion } from 'framer-motion'

export function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(56,189,248,0.2),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(139,92,246,0.18),transparent)]" />

      <div className="relative flex flex-col items-center">
        <div className="relative h-28 w-28 sm:h-32 sm:w-32">
          <div className="loader-ring absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-violet-500 opacity-90" />
          <div
            className="absolute inset-2 rounded-full border border-white/10"
            style={{ animationDirection: 'reverse' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              RC
            </span>
          </div>
        </div>
        <p className="mt-8 text-sm font-medium tracking-[0.35em] text-sky-300/90 uppercase">
          Loading portfolio
        </p>
        <p className="mt-2 text-xs text-slate-500">Syncing with API…</p>
      </div>
    </motion.div>
  )
}
