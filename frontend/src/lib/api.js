import staticPortfolio from '../data/portfolio.json'

const rawBase = import.meta.env.VITE_API_URL

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  if (rawBase && String(rawBase).trim()) {
    return `${String(rawBase).replace(/\/$/, '')}${p}`
  }
  return p
}

export async function fetchPortfolio() {
  // In production with no backend URL configured, use the bundled static JSON.
  // This means no Python server is required for the deployed site.
  if (import.meta.env.PROD && !rawBase) {
    return staticPortfolio
  }
  const res = await fetch(apiUrl('/api/portfolio'))
  if (!res.ok) {
    throw new Error(`Portfolio request failed (${res.status})`)
  }
  return res.json()
}

export async function postContactMessage(body) {
  // In production static mode, contact form submissions are handled client-side
  // (e.g. mailto link). If a backend URL is set, use it.
  if (import.meta.env.PROD && !rawBase) {
    throw new Error('Contact form requires a backend. Please email directly.')
  }
  const res = await fetch(apiUrl('/api/contact'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    const d = data?.detail
    let msg = res.statusText
    if (Array.isArray(d)) {
      msg = d.map((x) => x.msg ?? JSON.stringify(x)).join(' ')
    } else if (typeof d === 'string') {
      msg = d
    }
    throw new Error(msg)
  }
  return data
}
