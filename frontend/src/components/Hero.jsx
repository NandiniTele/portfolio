import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SocialIcons } from './SocialIcons'

function useTypewriter(text, speed = 42) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!text) {
      queueMicrotask(() => {
        setOut('')
        setDone(true)
      })
      return
    }
    queueMicrotask(() => {
      setOut('')
      setDone(false)
    })
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) {
        setDone(true)
        clearInterval(id)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return { out, done }
}

function downloadResume(lines) {
  const blob = new Blob([(lines || []).join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'Nandini_Tele_Resume.txt'
  a.rel = 'noopener'
  a.click()
  URL.revokeObjectURL(url)
}

export function Hero({ hero, resumeLines, contact }) {
  const tagline = hero?.tagline ?? ''
  const { out, done } = useTypewriter(tagline, 38)
  const initials = hero?.initials ?? 'TN'
  const name = hero?.name ?? ''
  const role = hero?.role ?? ''
  const hint = hero?.profile_hint ?? ''
  const profileImage = hero?.profile_image?.trim() || ''
  const profileAlt = hero?.profile_alt || name || 'Profile photo'

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center px-4 pt-28 pb-16 sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[120px]" />
        <div className="absolute top-1/3 right-[-10%] h-[380px] w-[380px] rounded-full bg-violet-600/25 blur-[100px]" />
        <div className="absolute bottom-0 left-[-15%] h-[420px] w-[420px] rounded-full bg-fuchsia-600/15 blur-[110px]" />
      </div>

      <div className="mx-auto grid max-w-6xl flex-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-medium tracking-[0.2em] text-sky-300/90 uppercase"
          >
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-display text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Hi, I&apos;m <span className="gradient-text">{name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-4 text-lg text-slate-300 sm:text-xl"
          >
            {role}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mt-6 min-h-[3.5rem] text-base text-slate-400 sm:text-lg ${!done ? 'cursor-blink' : ''}`}
          >
            {out}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_32px_rgba(99,102,241,0.35)] transition hover:brightness-110"
            >
              Get in touch
            </a>
            <button
              type="button"
              onClick={() => downloadResume(resumeLines)}
              className="glass inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(34,211,238,0.15)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download resume
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.45 }}
            className="mt-6"
          >
            <p className="mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase">Social</p>
            <SocialIcons contact={contact} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex max-w-sm justify-center lg:mx-0 lg:justify-end"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-500 opacity-70 blur-2xl" />
            <div className="glass relative overflow-hidden rounded-[2rem] p-1 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
              <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-slate-900 to-slate-950 sm:max-w-[360px]">
                {profileImage ? (
                  <>
                    <img
                      src={profileImage}
                      alt={profileAlt}
                      className="h-full w-full object-cover object-[center_20%]"
                      width={720}
                      height={720}
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                    <div className="flex h-36 w-36 items-center justify-center rounded-full border-2 border-cyan-400/30 bg-gradient-to-br from-slate-800 to-slate-900 shadow-[inset_0_0_40px_rgba(56,189,248,0.08)] sm:h-44 sm:w-44">
                      <span className="font-display text-4xl font-bold text-sky-200 sm:text-5xl">
                        {initials}
                      </span>
                    </div>
                    <p className="text-xs tracking-wide text-slate-500 uppercase">Profile photo</p>
                    {hint ? <p className="text-sm text-slate-400">{hint}</p> : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
