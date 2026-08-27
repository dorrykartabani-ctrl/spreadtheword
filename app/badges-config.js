// ═══════════════════════════════════════════════════════════════════
// GSTW BADGES CONFIG — Static Rewards & System Helper Logic
// ═══════════════════════════════════════════════════════════════════

// 1. RARITY COLORS & STYLES (Used across the app)
var RARITY_COLORS = {
  'common':   { bg: 'bg-common',   text: 'text-common',   border: 'border-slate-200',  glow: '' },
  'uncommon': { bg: 'bg-uncommon', text: 'text-uncommon', border: 'border-green-500/30', glow: '' },
  'rare':     { bg: 'bg-rare',     text: 'text-rare',     border: 'border-blue-500/30',  glow: '' },
  'epic':     { bg: 'bg-epic',     text: 'text-epic',     border: 'border-purple-500/30',glow: '' },
  'mythic':   { bg: 'bg-mythic',   text: 'text-mythic',   border: 'border-amber-500/50', glow: 'mythic-glow' }
};

// 2. SUBSCRIPTION ROADMAP (Fallback defaults)
var SUBSCRIPTION_ROADMAP = [
  { key: 'free',      badgeKey: 'called',    name: 'The Called',    tagline: 'Answered the call',        price: 'Free',         image: '/images/badges/called.svg' },
  { key: 'warrior',   badgeKey: 'warrior',   name: 'The Warrior',   tagline: 'Committed witness',        price: '$3.99/mo',     image: '/images/badges/warrior.svg' },
  { key: 'commander', badgeKey: 'commander', name: 'The Commander', tagline: 'Leading the mission',      price: '$5.99/mo',     image: '/images/badges/commander.svg' },
  { key: 'legacy',    badgeKey: 'legacy',    name: 'The Anointed',  tagline: 'Pillar of the movement',   price: 'Founder',      image: '/images/badges/legacy.svg' }
];

// 3. SPECIAL BADGES FALLBACK
var SPECIAL_BADGES = [
  {
    id: 'genesis',
    name: 'Genesis',
    description: 'One of the first 5 warriors to join the movement and test the app.',
    icon: 'rocket_launch', 
    image: '/images/badges/genesis.svg'
  },
  {
    id: '1000-generals',
    name: '1000 Generals',
    description: 'Part of the founding 1000 frontline commanders.',
    icon: 'military_tech',
    image: '/images/badges/1000-generals.svg'
  }
];

// ═══════════════════════════════════════════════════════════════════
// SYSTEM LOGIC & HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Calculates state for flat Supabase DB trophy rows OR multi-tier trophies
 */
function getTrophyState(trophy, stats) {
  var reqType = trophy.requirement_type || trophy.type || 'shares';
  
  // Normalize stats lookup
  var count = 0;
  if (reqType === 'shares') count = stats.shares || 0;
  else if (reqType === 'recruits' || reqType === 'recruits_paid' || reqType === 'warriors') count = stats.recruits_paid || stats.recruits || 0;
  else if (reqType === 'countries' || reqType === 'countries_paid' || reqType === 'nations') count = stats.countries_paid || stats.countries || 0;
  else count = stats[reqType] || 0;

  // Handle Multi-tier trophy objects (legacy)
  if (trophy.tiers && Array.isArray(trophy.tiers) && trophy.tiers.length > 0) {
    var currentTier = null;
    var nextTier = null;

    for (var i = 0; i < trophy.tiers.length; i++) {
      if (count >= trophy.tiers[i].req) {
        currentTier = trophy.tiers[i];
      } else {
        nextTier = trophy.tiers[i];
        break;
      }
    }

    var isUnlocked = currentTier !== null;
    var activeTier = currentTier || trophy.tiers[0];
    var progressPercent = 0;

    if (!isUnlocked) {
      progressPercent = Math.min(Math.round((count / trophy.tiers[0].req) * 100), 100);
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
      count: count,
      targetValue: nextTier ? nextTier.req : activeTier.req
    };
  }

  // Handle Flat Database Trophy Rows (Supabase trophy_definitions)
  var targetValue = Number(trophy.requirement_value || trophy.req || 1);
  var isUnlocked = count >= targetValue;
  var progressPercent = Math.min(Math.round((count / Math.max(targetValue, 1)) * 100), 100);

  return {
    isUnlocked: isUnlocked,
    activeTier: {
      name: trophy.name || trophy.title || 'Trophy',
      rarity: (trophy.rarity || 'common').toLowerCase(),
      req: targetValue,
      desc: trophy.description || ''
    },
    nextTier: isUnlocked ? null : { req: targetValue },
    progressPercent: progressPercent,
    count: count,
    targetValue: targetValue
  };
}

/**
 * Calculates which Era/Avatar stage the user is in based on Mythic trophies earned
 */
function calculateAvatarStage(trophyDefinitions, stats, avatarStages) {
  if (!avatarStages || avatarStages.length === 0) return null;

  var mythicCount = 0;
  if (trophyDefinitions && trophyDefinitions.length > 0) {
    trophyDefinitions.forEach(function(trophy) {
      var state = getTrophyState(trophy, stats);
      if (state.isUnlocked && state.activeTier && state.activeTier.rarity === 'mythic') {
        mythicCount++;
      }
    });
  }

  var maxStage = avatarStages.length - 1;
  var stageIndex = Math.min(mythicCount, maxStage);
  return avatarStages.find(function(s) { return s.stage === stageIndex; }) || avatarStages[0];
}

/**
 * Helper for Subscription Badge lookup
 */
function getUserSubscriptionBadge(profile) {
  if (!profile) return SUBSCRIPTION_ROADMAP[0];
  var tier = (profile.subscription_tier || 'free').toLowerCase();
  var found = SUBSCRIPTION_ROADMAP.find(function(t) { return t.key === tier; });
  return found || SUBSCRIPTION_ROADMAP[0];
}
