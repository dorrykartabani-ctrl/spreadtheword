// ═══════════════════════════════════════════════════════════════════
// GSTW BADGES CONFIG — Single source of truth for all badge metadata
// Update this file to change badge behavior anywhere in the app.
// ═══════════════════════════════════════════════════════════════════

var BADGE_CATALOG = {
  // ─── SUBSCRIPTION TIER BADGES ───
  // Displayed based on profiles.subscription_tier
  called: {
    key: 'called',
    type: 'subscription',
    tier: 'free',
    name: 'The Called',
    tagline: 'You answered the call',
    description: 'Welcome to the mission. You have joined thousands spreading the Word across the world.',
    image: '/images/badges/called.svg',
    bgColor: '#4A5560',
    rarity: 'common'
  },
  warrior: {
    key: 'warrior',
    type: 'subscription',
    tier: 'warrior',
    name: 'The Warrior',
    tagline: 'Committed to the mission',
    description: 'You committed with your subscription. The battle is joined and your voice fuels the movement.',
    image: '/images/badges/warrior.svg',
    bgColor: '#8B4513',
    rarity: 'uncommon'
  },
  commander: {
    key: 'commander',
    type: 'subscription',
    tier: 'commander',
    name: 'The Commander',
    tagline: 'Leading by example',
    description: 'Your commitment inspires and funds the movement. You lead the way for others to follow.',
    image: '/images/badges/commander.svg',
    bgColor: '#3d6285',
    rarity: 'rare'
  },
  legacy: {
    key: 'legacy',
    type: 'subscription',
    tier: 'legacy',
    name: 'The Anointed',
    tagline: 'A pillar of the mission',
    description: 'You are the foundation. Your legacy will outlive the movement itself.',
    image: '/images/badges/legacy.svg',
    bgColor: '#1E3A5F',
    rarity: 'legendary'
  }

  // ─── MISSION BADGES (to be added) ───
  // genesis: { ... }
  // '1000_generals': { ... }
}

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Get the user's current subscription badge based on their tier.
 * Falls back to 'called' if tier is missing/invalid.
 */
function getUserSubscriptionBadge(profile) {
  if (!profile) return BADGE_CATALOG.called
  var tier = (profile.subscription_tier || 'free').toLowerCase()
  if (tier === 'free') return BADGE_CATALOG.called
  return BADGE_CATALOG[tier] || BADGE_CATALOG.called
}

/**
 * Get all badges (subscription + missions) that a user currently holds.
 * missions param = array of user_missions rows (mission_key strings).
 */
function getUserAllBadges(profile, missions) {
  var badges = []
  var subBadge = getUserSubscriptionBadge(profile)
  if (subBadge) badges.push(subBadge)

  if (missions && missions.length) {
    missions.forEach(function(m) {
      var key = m.mission_key || m
      if (BADGE_CATALOG[key]) badges.push(BADGE_CATALOG[key])
    })
  }
  return badges
}

/**
 * Render a badge as an HTML string.
 * size: 'xs' (24px) | 'sm' (32px) | 'md' (48px) | 'lg' (80px) | 'xl' (120px) | 'hero' (160px)
 * showLabel: boolean - whether to show name/tagline below
 */
function renderBadgeHTML(badge, size, showLabel) {
  if (!badge) return ''
  var sizes = { xs: 24, sm: 32, md: 48, lg: 80, xl: 120, hero: 160 }
  var px = sizes[size] || 48

  var img = '<img src="' + badge.image + '" alt="' + badge.name + '" width="' + px + '" height="' + px + '" style="display:block;border-radius:50%;">'

  if (!showLabel) return img

  var textSize = px >= 120 ? '15px' : px >= 80 ? '14px' : '13px'
  var subSize = px >= 120 ? '12px' : '11px'

  return '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">'
    + img
    + '<div style="text-align:center;">'
      + '<p style="font-family:\'Plus Jakarta Sans\',sans-serif;font-weight:800;color:#31332e;font-size:' + textSize + ';margin:0;letter-spacing:-0.02em;">' + badge.name + '</p>'
      + '<p style="font-family:\'Manrope\',sans-serif;color:#5e6059;font-size:' + subSize + ';margin:2px 0 0 0;">' + badge.tagline + '</p>'
    + '</div>'
  + '</div>'
}

/**
 * Render just the badge image at a specific size.
 * Convenient shortcut for inline use.
 */
function renderBadgeImg(badgeKey, sizePx) {
  var badge = BADGE_CATALOG[badgeKey]
  if (!badge) return ''
  return '<img src="' + badge.image + '" alt="' + badge.name + '" width="' + sizePx + '" height="' + sizePx + '" style="display:inline-block;border-radius:50%;vertical-align:middle;">'
}
