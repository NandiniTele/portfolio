import { SectionReveal } from './SectionReveal'

export function About({ summary }) {
  return (
    <section id="about" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            About <span className="gradient-text">me</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-sky-300/80">Introduction</p>
        </SectionReveal>

        <SectionReveal className="mt-10" delay={0.08}>
          <div className="glass rounded-3xl p-6 sm:p-10">
            <p className="text-base leading-relaxed text-slate-300 sm:text-lg">{summary}</p>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
