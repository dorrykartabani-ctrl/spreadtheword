// ═══════════════════════════════════════════════════════════════════
// GSTW BADGES CONFIG — Dynamic Database-Driven Version
// ═══════════════════════════════════════════════════════════════════

// We keep the colors here because they relate to your CSS classes
var RARITY_COLORS = {
  'common':   { bg: 'bg-common',   text: 'text-common' },
  'uncommon': { bg: 'bg-uncommon', text: 'text-uncommon' },
  'rare':     { bg: 'bg-rare',     text: 'text-rare' },
  'epic':     { bg: 'bg-epic',     text: 'text-epic' },
  'mythic':   { bg: 'bg-mythic',   text: 'text-mythic' }
};

// We keep Subscription Roadmap here for UI navigation
var SUBSCRIPTION_ROADMAP = [
  { key: 'free',      badgeKey: 'called',    name: 'The Called',    tagline: 'Answered the call',        price: 'Free',         image: '/images/badges/called.svg' },
  { key: 'warrior',   badgeKey: 'warrior',   name: 'The Warrior',   tagline: 'Committed witness',        price: '$3.99/mo',     image: '/images/badges/warrior.svg' },
  { key: 'commander', badgeKey: 'commander', name: 'The Commander', tagline: 'Leading the mission',      price: '$5.99/mo',     image: '/images/badges/commander.svg' },
  { key: 'legacy',    badgeKey: 'legacy',    name: 'The Anointed',  tagline: 'Pillar of the movement',   price: 'Founder',      image: '/images/badges/legacy.svg' }
];

/**
 * Determines a specific trophy's state based on dynamic DB tiers
 * @param {Object} trophy - The trophy row from Supabase
 * @param {Object} stats - The user's current stats {shares, recruits_paid, etc}
 */
function getTrophyState(trophy, stats) {
  var count = stats[trophy.type] || 0;
  var tiers = trophy.tiers; // This is the JSONB from Supabase

  var currentTier = null;
  var nextTier = null;

  for (var i = 0; i < tiers.length; i++) {
    if (count >= tiers[i].req) {
      currentTier = tiers[i];
    } else {
      nextTier = tiers[i];
      break;
    }
  }

  var isUnlocked = currentTier !== null;
  var activeTier = currentTier || tiers[0];

  var progressPercent = 0;
  if (!isUnlocked) {
    progressPercent = Math.min(Math.round((count / tiers[0].req) * 100), 100);
  } else if (nextTier) {
    var prevReq = currentTier.req;
    var range = nextTier.req - prevReq;
    progressPercent = Math.min(Math.round(((count - prevReq) / range) * 100), 100);
  } else {
    progressPercent = 100;
  }

  return {
    isUnlocked: isUnlocked,
    activeTier: activeTier,
    nextTier: nextTier,
    progressPercent: progressPercent,
    count: count
  };
}

/**
 * Calculates which Era/Avatar stage the user is in
 */
function calculateAvatarStage(trophyDefinitions, stats, avatarStages) {
  var mythicCount = 0;
  
  trophyDefinitions.forEach(trophy => {
    var state = getTrophyState(trophy, stats);
    if (state.isUnlocked && state.activeTier.rarity === 'mythic') {
      mythicCount++;
    }
  });

  // Level up stage for every Mythic earned (capped at max stage available)
  var stageIndex = Math.min(mythicCount, avatarStages.length - 1);
  return avatarStages.find(s => s.stage === stageIndex) || avatarStages[0];
}

/**
 * Helper to calculate sharing streak
 */
function calculateStreak(shares) {
  if (!shares || shares.length === 0) return 0;
  var dates = [...new Set(shares.map(s => new Date(s.shared_at).toISOString().split('T')[0]))];
  dates.sort().reverse();
  var streak = 0;
  var today = new Date().toISOString().split('T')[0];
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday = yesterday.toISOString().split('T')[0];

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  for (let i = 0; i < dates.length - 1; i++) {
    var diff = (new Date(dates[i]) - new Date(dates[i+1])) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++; else break;
  }
  return streak + 1;
}

/**
 * Helper for Subscription UI
 */
function getUserSubscriptionBadge(profile) {
  if (!profile) return SUBSCRIPTION_ROADMAP[0];
  var tier = (profile.subscription_tier || 'free').toLowerCase();
  var found = SUBSCRIPTION_ROADMAP.find(function(t) { return t.key === tier; });
  return found || SUBSCRIPTION_ROADMAP[0];
}
