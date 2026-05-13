const footerLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#certifications', label: 'Certs' },
  { href: '#internships', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
]

export function Footer({ name = 'TELE NANDINI', tagline }) {
  return (
    <footer className="relative border-t border-white/10 bg-slate-950/80 px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
        <div className="text-center sm:text-left">
          <p className="font-display text-xl font-bold text-white">
            {name}
            <span className="text-sky-400">.</span>
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            {tagline ??
              'B.Tech CSE student building thoughtful software. Crafted with React, Tailwind, and Framer Motion.'}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-slate-600 sm:text-right">
        © {new Date().getFullYear()} {name}. All rights reserved.
      </p>
    </footer>
  )
}
