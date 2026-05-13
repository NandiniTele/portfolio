const rawBase = import.meta.env.VITE_API_URL

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  if (rawBase && String(rawBase).trim()) {
    return `${String(rawBase).replace(/\/$/, '')}${p}`
  }
  return p
}

export async function fetchPortfolio() {
  const res = await fetch(apiUrl('/api/portfolio'))
  if (!res.ok) {
    throw new Error(`Portfolio request failed (${res.status})`)
  }
  return res.json()
}

export async function postContactMessage(body) {
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
