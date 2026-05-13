import { motion } from 'framer-motion'
import { SectionReveal } from './SectionReveal'

function normalizeCert(item, index) {
  if (typeof item === 'string') {
    return {
      key: `cert-${index}-${item}`,
      title: item,
      issuer: '',
      date: '',
      url: '',
      description: '',
    }
  }
  return {
    key: `cert-${index}-${item.title ?? ''}`,
    title: item.title ?? '',
    issuer: item.issuer ?? '',
    date: item.date ?? '',
    url: item.url ?? '',
    description: item.description ?? '',
  }
}

export function Certifications({ items = [] }) {
  const rows = items.map(normalizeCert)

  return (
    <section id="certifications" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="gradient-text">Certifications</span>
          </h2>
          <p className="mt-3 text-sm text-fuchsia-300/70">Credentials & events</p>
        </SectionReveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {rows.map((c, i) => (
            <SectionReveal key={c.key} delay={0.05 * i}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="glass flex h-full flex-col rounded-2xl p-6 transition hover:border-violet-400/35 hover:shadow-[0_0_28px_rgba(139,92,246,0.15)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/45 to-sky-500/35 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-sky-400 hover:text-sky-300"
                    >
                      Verify →
                    </a>
                  ) : null}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{c.title}</h3>
                {(c.issuer || c.date) && (
                  <p className="mt-1 text-xs text-slate-500">
                    {[c.issuer, c.date].filter(Boolean).join(' · ')}
                  </p>
                )}
                {c.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{c.description}</p>
                ) : null}
              </motion.article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
