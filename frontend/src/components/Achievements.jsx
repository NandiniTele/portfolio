import { motion } from 'framer-motion'
import { SectionReveal } from './SectionReveal'

export function Achievements({ items = [] }) {
  if (!items.length) return null

  return (
    <section id="achievements" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="gradient-text">Achievements</span>
          </h2>
          <p className="mt-3 text-sm text-cyan-300/70">Highlights & recognitions</p>
        </SectionReveal>

        <ul className="mt-10 space-y-4">
          {items.map((a, i) => (
            <SectionReveal key={`${a.title}-${i}`} delay={0.05 * i}>
              <motion.li
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="glass flex gap-4 rounded-2xl p-5 sm:p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-sm font-bold text-cyan-200">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display font-semibold text-white">{a.title}</h3>
                  {a.detail ? <p className="mt-2 text-sm leading-relaxed text-slate-400">{a.detail}</p> : null}
                </div>
              </motion.li>
            </SectionReveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
