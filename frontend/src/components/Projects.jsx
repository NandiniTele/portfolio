import { motion } from 'framer-motion'
import { SectionReveal } from './SectionReveal'

const icons = {
  eye: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ),
  code: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  ),
}

export function Projects({ items = [] }) {
  return (
    <section id="projects" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Featured <span className="gradient-text">projects</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400">Selected work from academics & builds</p>
        </SectionReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {items.map((p, i) => (
            <SectionReveal key={p.title} delay={0.08 * i}>
              <motion.article
                whileHover={{ y: -10, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="glass group relative h-full overflow-hidden rounded-3xl p-8 transition hover:border-violet-400/25 hover:shadow-[0_0_40px_rgba(139,92,246,0.18)]"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-sky-500/30 to-violet-600/20 blur-3xl transition duration-500 group-hover:scale-110" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/30 to-violet-600/40 text-sky-100">
                    {icons[p.icon] ?? icons.code}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
                      {p.description}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {(p.tags || []).map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
