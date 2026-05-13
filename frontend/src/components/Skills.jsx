import { SectionReveal } from './SectionReveal'

export function Skills({ groups = [] }) {
  return (
    <section id="skills" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Skills & <span className="gradient-text">tools</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400">Stack I work with</p>
        </SectionReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {groups.map((g, i) => (
            <SectionReveal key={g.title} delay={0.05 * i}>
              <div className="glass relative h-full overflow-hidden rounded-2xl p-6 sm:p-8">
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${g.accent ?? 'from-sky-500/15 to-transparent'}`}
                />
                <h3 className="font-display relative text-lg font-semibold text-white">{g.title}</h3>
                <ul className="relative mt-4 flex flex-wrap gap-2">
                  {(g.items || []).map((skill) => (
                    <li
                      key={skill}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
