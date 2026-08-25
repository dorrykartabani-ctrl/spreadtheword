// ═══════════════════════════════════════════════════════════════════
// GSTW BADGES CONFIG — Static Rewards & System Logic
// ═══════════════════════════════════════════════════════════════════

// 1. RARITY COLORS (Used across the app)
var RARITY_COLORS = {
  'common':   { bg: 'bg-common',   text: 'text-common' },
  'uncommon': { bg: 'bg-uncommon', text: 'text-uncommon' },
  'rare':     { bg: 'bg-rare',     text: 'text-rare' },
  'epic':     { bg: 'bg-epic',     text: 'text-epic' },
  'mythic':   { bg: 'bg-mythic',   text: 'text-mythic' }
};

// 2. SUBSCRIPTION ROADMAP (Static)
var SUBSCRIPTION_ROADMAP = [
  { key: 'free',      badgeKey: 'called',    name: 'The Called',    tagline: 'Answered the call',        price: 'Free',         image: '/images/badges/called.svg' },
  { key: 'warrior',   badgeKey: 'warrior',   name: 'The Warrior',   tagline: 'Committed witness',        price: '$3.99/mo',     image: '/images/badges/warrior.svg' },
  { key: 'commander', badgeKey: 'commander', name: 'The Commander', tagline: 'Leading the mission',      price: '$5.99/mo',     image: '/images/badges/commander.svg' },
  { key: 'legacy',    badgeKey: 'legacy',    name: 'The Anointed',  tagline: 'Pillar of the movement',   price: 'Founder',      image: '/images/badges/legacy.svg' }
];

// 3. SPECIAL BADGES (One-off achievements like Genesis)
var SPECIAL_BADGES = [
  {
    id: 'genesis',
    name: 'Genesis',
    description: 'One of the first 5 warriors to join the movement and test the app.',
    icon: 'rocket_launch', 
    image: '/images/badges/genesis.svg', // Make sure to add this image to your folder!
    condition: 'first_5_testers' 
  }
];

// ══════════════════════════════════════════════════════════════════
// SYSTEM LOGIC & HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Determines a specific trophy's state based on dynamic DB tiers
 * (Trophies are now loaded from Supabase, not this file)
 */
function getTrophyState(trophy, stats) {
  var count = stats[trophy.type] || 0;
  var tiers = trophy.tiers; 

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
  if (!avatarStages || avatarStages.length === 0) return null;

  var mythicCount = 0;
  
  if (trophyDefinitions && trophyDefinitions.length > 0) {
    trophyDefinitions.forEach(trophy => {
      var state = getTrophyState(trophy, stats);
      if (state.isUnlocked && state.activeTier.rarity === 'mythic') {
        mythicCount++;
      }
    });
  }

  var stageIndex = Math.min(mythicCount, avatarStages.length - 1);
  var found = avatarStages.find(s => s.stage === stageIndex);
  
  return found || avatarStages[0];
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
