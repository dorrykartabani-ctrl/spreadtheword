// ============================================================
// SUPABASE CLIENT — Go Spread The Word
// ============================================================
// Replace the values below with your actual keys
// NEVER commit real keys to a public GitHub repo
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://nhymadutuhpjgkiurify.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oeW1hZHV0dWhwamdraXVyaWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTI5NzgsImV4cCI6MjA5NTU2ODk3OH0.kC5Ytuoi8Sy97ZTSZ8lEWeH1rngcbeHSxobOMIQahkM'

export const db = createClient(SUPABASE_URL, SUPABASE_KEY)

// ============================================================
// AUTH HELPERS
// ============================================================

export async function getCurrentUser() {
  const { data: { user } } = await db.auth.getUser()
  return user
}

export async function getUserProfile(userId) {
  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) { console.error('Profile error:', error); return null }
  return data
}

export async function signOut() {
  const { error } = await db.auth.signOut()
  if (error) console.error('Sign out error:', error)
  window.location.href = '../app/login.html'
}

// ============================================================
// QUOTES HELPERS
// ============================================================

export async function getTodaysQuote() {
  const { data, error } = await db
    .from('quotes')
    .select('*')
    .eq('status', 'live')
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (error) { console.error('Quote error:', error); return null }
  return data
}

export async function getAllLiveQuotes() {
  const { data, error } = await db
    .from('quotes')
    .select('*')
    .eq('status', 'live')
    .order('published_at', { ascending: false })

  if (error) { console.error('Quotes error:', error); return [] }
  return data
}

export async function getAllQuotes() {
  const { data, error } = await db
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) { console.error('Quotes error:', error); return [] }
  return data
}

export async function createQuote(quoteData) {
  const { data, error } = await db
    .from('quotes')
    .insert([quoteData])
    .select()
    .single()

  if (error) { console.error('Create quote error:', error); return null }
  return data
}

export async function updateQuote(id, updates) {
  const { data, error } = await db
    .from('quotes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) { console.error('Update quote error:', error); return null }
  return data
}

export async function deleteQuote(id) {
  const { error } = await db
    .from('quotes')
    .delete()
    .eq('id', id)

  if (error) { console.error('Delete quote error:', error); return false }
  return true
}

// ============================================================
// HASHTAG HELPERS
// ============================================================

export async function getAllHashtags() {
  const { data, error } = await db
    .from('hashtags')
    .select('*')
    .order('usage_count', { ascending: false })

  if (error) { console.error('Hashtags error:', error); return [] }
  return data
}

export async function getCoreHashtags() {
  const { data, error } = await db
    .from('hashtags')
    .select('*')
    .eq('is_core', true)

  if (error) { console.error('Core hashtags error:', error); return [] }
  return data
}

// ============================================================
// PROJECTS HELPERS
// ============================================================

export async function getActiveProjects() {
  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false })

  if (error) { console.error('Projects error:', error); return [] }
  return data
}

export async function getAllProjects() {
  const { data, error } = await db
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) { console.error('Projects error:', error); return [] }
  return data
}

export async function updateProject(id, updates) {
  const { data, error } = await db
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) { console.error('Update project error:', error); return null }
  return data
}

export async function createProject(projectData) {
  const { data, error } = await db
    .from('projects')
    .insert([projectData])
    .select()
    .single()

  if (error) { console.error('Create project error:', error); return null }
  return data
}

export async function getUserProjectPriorities(userId) {
  const { data, error } = await db
    .from('project_priorities')
    .select('*, projects(*)')
    .eq('user_id', userId)
    .order('priority', { ascending: true })

  if (error) { console.error('Priorities error:', error); return [] }
  return data
}

export async function setProjectPriority(userId, projectId, priority) {
  const { data, error } = await db
    .from('project_priorities')
    .upsert({
      user_id:    userId,
      project_id: projectId,
      priority:   priority
    })
    .select()
    .single()

  if (error) { console.error('Set priority error:', error); return null }
  return data
}

// ============================================================
// SHARES HELPERS
// ============================================================

export async function logShare(userId, quoteId, platform, options = {}) {
  const { data, error } = await db
    .from('shares')
    .insert([{
      user_id:   userId,
      quote_id:  quoteId,
      platform:  platform,
      font_used: options.font  || null,
      color_used:options.color || null,
      has_selfie:options.selfie || false,
    }])
    .select()
    .single()

  if (error) { console.error('Log share error:', error); return null }
  return data
}

export async function getUserShares(userId) {
  const { data, error } = await db
    .from('shares')
    .select('*, quotes(*)')
    .eq('user_id', userId)
    .order('shared_at', { ascending: false })

  if (error) { console.error('User shares error:', error); return [] }
  return data
}

export async function getUserShareCount(userId) {
  const { count, error } = await db
    .from('shares')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) { console.error('Share count error:', error); return 0 }
  return count
}

// ============================================================
// STATS HELPERS (for Analytics + Admin Dashboard)
// ============================================================

export async function getGlobalStats() {
  const [warriors, shares, quotes, projects] = await Promise.all([
    db.from('profiles').select('*', { count: 'exact', head: true }),
    db.from('shares').select('*',   { count: 'exact', head: true }),
    db.from('quotes').select('*',   { count: 'exact', head: true }).eq('status', 'live'),
    db.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  return {
    totalWarriors: warriors.count || 0,
    totalShares:   shares.count   || 0,
    totalQuotes:   quotes.count   || 0,
    activeProjects:projects.count || 0,
  }
}

export async function getSharesByPlatform() {
  const { data, error } = await db
    .from('shares')
    .select('platform')

  if (error) { console.error('Platform stats error:', error); return {} }

  const counts = {}
  data.forEach(share => {
    counts[share.platform] = (counts[share.platform] || 0) + 1
  })
  return counts
}