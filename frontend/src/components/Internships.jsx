import { motion } from 'framer-motion'
import { SectionReveal } from './SectionReveal'

export function Internships({ items = [] }) {
  if (!items.length) return null

  return (
    <section id="internships" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Internships & <span className="gradient-text">experience</span>
          </h2>
          <p className="mt-3 text-sm text-sky-300/70">Roles and practical exposure</p>
        </SectionReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {items.map((job, i) => (
            <SectionReveal key={`${job.title}-${job.organization}-${i}`} delay={0.06 * i}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="glass relative h-full overflow-hidden rounded-2xl p-6 sm:p-8"
              >
                <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />
                <p className="text-xs font-medium tracking-wide text-violet-300 uppercase">
                  {job.period || 'Dates TBD'}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-white">{job.title}</h3>
                <p className="mt-1 text-sm font-medium text-slate-300">{job.organization}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">{job.description}</p>
                {job.skills?.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <li
                        key={s}
                        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-200"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </motion.article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
