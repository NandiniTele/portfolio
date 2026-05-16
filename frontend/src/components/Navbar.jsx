import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#certifications', label: 'Certs' },
  { href: '#internships', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
]

function useHash() {
  const [hash, setHash] = useState(
    () => (typeof window !== 'undefined' ? window.location.hash || '#home' : '#home'),
  )

  useEffect(() => {
    const sync = () => setHash(window.location.hash || '#home')
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  return hash || '#home'
}

export function Navbar({ brand = 'RC' }) {
  const [open, setOpen] = useState(false)
  const hash = useHash()

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-slate-950/80 shadow-lg backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <a
          href="#home"
          className="shrink-0 font-display text-lg font-bold tracking-tight text-white transition hover:text-sky-400"
        >
          {brand}
          <span className="text-sky-500">.</span>
        </a>

        <ul className="hidden items-center gap-1 sm:gap-2 md:flex md:flex-1 md:justify-center">
          {links.map((l) => {
            const active = hash === l.href
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'text-sky-400'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5 bg-slate-950 md:hidden"
          >
            <ul className="flex flex-col py-2">
              {links.map((l) => {
                const active = hash === l.href
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block px-5 py-3 text-sm font-medium ${
                        active ? 'text-sky-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
