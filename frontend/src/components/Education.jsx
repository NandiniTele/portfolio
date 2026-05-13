import { SectionReveal } from './SectionReveal'

export function Education({ items = [] }) {
  return (
    <section id="education" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            <span className="gradient-text">Education</span>
          </h2>
          <p className="mt-3 text-sm text-violet-300/80">Academic journey</p>
        </SectionReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <SectionReveal key={`${item.title}-${item.place}`} delay={0.06 * i}>
              <article className="glass group relative h-full overflow-hidden rounded-2xl p-6 transition hover:border-sky-400/30 hover:shadow-[0_0_28px_rgba(56,189,248,0.12)]">
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-sky-500/10 blur-2xl transition group-hover:bg-violet-500/20" />
                <span className="inline-block rounded-full bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-sky-200 uppercase">
                  {item.tag}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.place}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
