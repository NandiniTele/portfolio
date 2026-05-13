import { ParticleBackground } from '../components/ParticleBackground'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { Skills } from '../components/Skills'
import { Projects } from '../components/Projects'
import { Certifications } from '../components/Certifications'
import { Internships } from '../components/Internships'
import { Achievements } from '../components/Achievements'
import { Education } from '../components/Education'
import { Contact } from '../components/Contact'


export function HomePage({ data }) {
  const {
    hero,
    about,
    education,
    skills,
    projects,
    certifications,
    internships,
    achievements,
    contact,
    resume_lines: resumeLines,
    meta,
  } = data

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-200">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.15),transparent)]" />
      <ParticleBackground />
      <Navbar brand={hero?.initials ?? 'TN'} />
      <main className="relative z-10">
        <Hero hero={hero} resumeLines={resumeLines} contact={contact} />
        <About summary={about?.summary ?? ''} />
        <Skills groups={skills ?? []} />
        <Projects items={projects ?? []} />
        <Certifications items={certifications ?? []} />
        <Internships items={internships ?? []} />
        <Achievements items={achievements ?? []} />
        <Education items={education ?? []} />
        <Contact contact={contact} />
      </main>

    </div>
  )
}
