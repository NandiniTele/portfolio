import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionReveal } from './SectionReveal'
import { SocialIcons } from './SocialIcons'
import { postContactMessage } from '../lib/api'

const IS_STATIC = import.meta.env.PROD && !import.meta.env.VITE_API_URL

export function Contact({ contact }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)

  if (!contact) return null

  const { phone, phone_e164, email, linkedin, linkedin_label, github } = contact

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setStatus(null)

    // In static/production mode: open a pre-filled mailto: link
    if (IS_STATIC) {
      const subject = encodeURIComponent(`Message from ${form.name}`)
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
      )
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
      return
    }

    setSending(true)
    try {
      const res = await postContactMessage(form)
      setStatus(res?.detail ?? 'Message sent successfully.')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Let&apos;s <span className="gradient-text">connect</span>
          </h2>
          <p className="mt-3 text-sm text-slate-400">Open to internships & entry-level roles</p>
        </SectionReveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <SectionReveal delay={0.05}>
            <div className="glass rounded-3xl p-6 sm:p-8">
              <h3 className="font-display text-lg font-semibold text-white">Direct contact</h3>
              <ul className="mt-6 space-y-4 text-sm text-slate-300 sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-sky-400" aria-hidden>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs tracking-wide text-slate-500 uppercase">Phone</p>
                    <a href={`tel:${phone_e164 ?? phone}`} className="text-white hover:text-sky-300">
                      {phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-violet-400" aria-hidden>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs tracking-wide text-slate-500 uppercase">Email</p>
                    <a href={`mailto:${email}`} className="break-all text-white hover:text-violet-300">
                      {email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-fuchsia-400" aria-hidden>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs tracking-wide text-slate-500 uppercase">LinkedIn</p>
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-white hover:text-fuchsia-300"
                    >
                      {linkedin_label ?? linkedin}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <SocialIcons contact={contact} />
                {github ? (
                  <motion.a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub profile
                  </motion.a>
                ) : null}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-8" noValidate>
              <h3 className="font-display text-lg font-semibold text-white">Send a message</h3>
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-slate-400">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none ring-sky-500/40 placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-2"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-400">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none ring-sky-500/40 placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-2"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-slate-400">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none ring-sky-500/40 placeholder:text-slate-600 focus:border-sky-500/50 focus:ring-2"
                    placeholder="Tell me about the role or project..."
                  />
                </div>
              </div>
              {status && (
                <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {status}
                </p>
              )}
              {error && (
                <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}
              {IS_STATIC && (
                <p className="mt-4 text-xs text-slate-500">
                  Clicking Submit will open your email client with a pre-filled message.
                </p>
              )}
              <button
                type="submit"
                disabled={sending}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
              >
                {sending ? 'Sending…' : IS_STATIC ? 'Open Email App' : 'Submit'}
              </button>
            </form>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
