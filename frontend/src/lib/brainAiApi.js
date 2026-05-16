const BRAIN_AI_BASE = '/api/brain-ai'

export async function fetchBrainAIStatus() {
  const res = await fetch(`${BRAIN_AI_BASE}/status`)
  if (!res.ok) throw new Error('Failed to fetch Brain-AI status')
  return res.json()
}

export async function startSession(userId = 'default_user') {
  const res = await fetch(`${BRAIN_AI_BASE}/session/start?user_id=${userId}`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to start session')
  return res.json()
}

export async function analyzeSignal(state = null) {
  const url = state ? `${BRAIN_AI_BASE}/analyze?state=${state}` : `${BRAIN_AI_BASE}/analyze`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to analyze signal')
  return res.json()
}

export async function fetchSnapshot() {
  const res = await fetch(`${BRAIN_AI_BASE}/snapshot`)
  if (!res.ok) throw new Error('Failed to fetch snapshot')
  return res.json()
}

export async function fetchUserProfile() {
  const res = await fetch(`${BRAIN_AI_BASE}/profile`)
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export async function fetchAvailableStates() {
  const res = await fetch(`${BRAIN_AI_BASE}/states`)
  if (!res.ok) throw new Error('Failed to fetch states')
  return res.json()
}

export async function fetchPredictionHistory(limit = 20) {
  const res = await fetch(`${BRAIN_AI_BASE}/history?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}
