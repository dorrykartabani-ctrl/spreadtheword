// ═══════════════════════════════════════════════════════════════════
// GSTW BADGES CONFIG — Master Configuration
// ═══════════════════════════════════════════════════════════════════

var SUBSCRIPTION_ROADMAP = [
  { key: 'free',      badgeKey: 'called',    name: 'The Called',    tagline: 'Answered the call',        price: 'Free',         image: '/images/badges/called.svg',    bgColor: '#4A5560' },
  { key: 'warrior',   badgeKey: 'warrior',   name: 'The Warrior',   tagline: 'Committed witness',        price: '$3.99/mo',     image: '/images/badges/warrior.svg',   bgColor: '#8B4513' },
  { key: 'commander', badgeKey: 'commander', name: 'The Commander', tagline: 'Leading the mission',      price: '$5.99/mo',     image: '/images/badges/commander.svg', bgColor: '#3d6285' },
  { key: 'legacy',    badgeKey: 'legacy',    name: 'The Anointed',  tagline: 'Pillar of the movement',   price: 'Founder/Admin',image: '/images/badges/legacy.svg',    bgColor: '#1E3A5F' }
];

var EVOLVING_TROPHIES = [
  {
    id: 'sower',
    title: 'The Sower',
    icon: 'grass',
    type: 'shares',
    description: 'Planting seeds of the Word through daily sharing.',
    tiers: [
      { level: 1, req: 1,    rarity: 'common',   name: 'Common Sower',   desc: 'You planted your first seed.' },
      { level: 2, req: 25,   rarity: 'uncommon', name: 'Uncommon Sower', desc: '25 seeds planted in the field.' },
      { level: 3, req: 100,  rarity: 'rare',     name: 'Rare Sower',     desc: '100 seeds sown across the land.' },
      { level: 4, req: 500,  rarity: 'epic',     name: 'Epic Sower',     desc: '500 words spread. An abundant harvest.' },
      { level: 5, req: 1000, rarity: 'mythic',   name: 'Mythic Sower',   desc: '1000 words spread. A champion evangelist.' }
    ]
  },
  {
    id: 'shepherd',
    title: 'The Shepherd',
    icon: 'handshake',
    type: 'recruits',
    description: 'Inviting new warriors into the fold.',
    tiers: [
      { level: 1, req: 1,  rarity: 'common',   name: 'Common Shepherd',   desc: 'Brought 1 warrior into the fold.' },
      { level: 2, req: 5,  rarity: 'uncommon', name: 'Uncommon Shepherd', desc: '5 warriors follow your call.' },
      { level: 3, req: 10, rarity: 'rare',     name: 'Rare Shepherd',     desc: '10 warriors guided in truth.' },
      { level: 4, req: 25, rarity: 'epic',     name: 'Epic Shepherd',     desc: '25 warriors joined because of you.' },
      { level: 5, req: 50, rarity: 'mythic',   name: 'Mythic Shepherd',   desc: '50 warriors leading the charge.' }
    ]
  }
];

function getUserSubscriptionBadge(profile) {
  if (!profile) return SUBSCRIPTION_ROADMAP[0];
  var tier = (profile.subscription_tier || 'free').toLowerCase();
  var found = SUBSCRIPTION_ROADMAP.find(function(t) { return t.key === tier; });
  return found || SUBSCRIPTION_ROADMAP[0];
}

function getTrophyState(trophy, userShares, userRecruits) {
  var count = trophy.type === 'shares' ? userShares : userRecruits;
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
    currentTier: currentTier,
    nextTier: nextTier,
    activeTier: activeTier,
    progressPercent: progressPercent,
    count: count
  };
}
