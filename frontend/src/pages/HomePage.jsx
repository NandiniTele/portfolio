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
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] text-slate-200">
      {/* Deep space black + midnight navy background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-br from-[#02040a] via-[#040b16] to-[#020617]" />
      
      {/* Interactive cyber-grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 cyber-grid opacity-50" />
      
      {/* Floating holographic orbs and light leaks */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-sky-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] right-[-20%] h-[60vh] w-[60vw] rounded-full bg-indigo-600/10 blur-[130px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] h-[70vh] w-[70vw] rounded-full bg-fuchsia-600/10 blur-[150px] mix-blend-screen" />
      </div>

      <ParticleBackground />
      <Navbar brand={hero?.initials ?? 'RC'} />
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
