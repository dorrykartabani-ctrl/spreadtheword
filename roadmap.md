# GSTW — Product Roadmap & Future Features

> Living document capturing all deferred features, expansion plans, and long-term vision decisions made during development.
> 
> **Last updated:** [Current session]
> **Status:** Reference document — not for immediate implementation

---

## 🎯 Vision Summary

**Go Spread The Word (GSTW)** is a PWA that turns daily scripture/inspiration into shareable content. Users pay $3.99/month, and because it's a PWA (no App Store fees), a significant portion of that goes directly to missions of the user's choice.

**Core loop:** Home (inspire) → Editor (create) → Preview (share) → Impact (reward)

**Retention engine:** Impact page — where users see growth, earn badges, and eventually watch their avatar evolve through spiritual eras.

---

## 🏛️ AVATAR PROGRESSION SYSTEM (Major Future Feature)

### The Concept
An **evolving visual character** that reveals new eras and progression over years of engagement. Drives long-term retention through identity investment. Users don't just track numbers — they become someone.

### The Four Eras

| Era | Theme | Levels | Unlock Trigger |
|-----|-------|--------|----------------|
| **Era 1** | Hebrew/Persian (Old Testament) | 1–7 | Default (all users start here) |
| **Era 2** | Roman/Biblical (New Testament) | 8–20 | Complete Era 1 (500 shares) |
| **Era 3** | Medieval/Crusader | 21–35 | Complete Era 2 (~2000 shares) |
| **Era 4** | Armor of God (Ephesians 6) | 36–50 | Complete Era 3 (~5000 shares) |

### Era 1 Ranks (MVP — 7 tiers)

| Level | Rank | Share Threshold | Visual Concept |
|-------|------|-----------------|----------------|
| 1 | Seeker | 0 | Simple robe, bare feet, no adornments |
| 2 | Servant | 10 | Basic tunic, leather sandals, small pouch |
| 3 | Disciple | 30 | Traveling cloak, walking staff |
| 4 | Herald | 75 | Fine robes, prayer shawl (tallit), scroll |
| 5 | Teacher | 150 | Rabbi-inspired, phylacteries, ornate belt |
| 6 | Elder | 300 | Long white hair/beard, staff of authority, deep robes |
| 7 | Prophet | 500 | Radiant robes, olive crown, glowing halo |

### Era 2 Ranks (Roman — 13 tiers)
Levels 8–20. Progression from Legionnaire → Centurion → Commander → General → Imperator.

### Era 3 Ranks (Medieval — 15 tiers)
Levels 21–35. Squire → Knight → Templar → Crusader → Champion.

### Era 4 Ranks (Armor of God — 15 tiers)
Levels 36–50. Each level adds one piece of the biblical armor from Ephesians 6:
- Belt of Truth
- Breastplate of Righteousness
- Feet Shod with Peace
- Shield of Faith
- Helmet of Salvation
- Sword of the Spirit
- Full Armor Bearer (final tier)

### Visual System (Phased Approach)

**Phase 1 — MVP:** Beautiful stylized SVG placeholders (medallion/ancient coin style)
- Circular design (like a coin/seal)
- Bronze/gold gradient backgrounds
- Weathered, historical texture
- Rank icon centered
- Rank name inscribed below
- Aura/glow intensity increases with level

**Phase 2 — Illustrations:** Commissioned or AI-generated (5-7 initial images per era)
- Code structured for one-line swap: `AVATAR_SOURCE = 'medallion'` → `'illustration'`

**Phase 3 — Layered SVG System:** Composable pieces users can unlock and equip individually

### Badge Display on Avatar
- **Sash/necklace** across avatar chest
- Displays up to **3-5 featured badges** (user's choice)
- User long-presses badge in Trophy Wall to feature/unfeature
- Rest visible in Trophy Wall grid

### Identity Naming
Rank name replaces "Warrior" throughout the app:
- Header: "Marcus · Centurion"
- Community: "Marcus (Centurion) shared today"
- Profile: Full rank displayed prominently
- Level number de-emphasized — rank name IS the identity

### Era Transition Ceremony (Major Moment)
Triggered when user reaches final level of current era:
1. Full-screen takeover
2. Long trumpet fanfare (era-appropriate music)
3. Old avatar fades out with parting message
4. Dark screen with ancient text: "A new era awaits..."
5. New era title reveal with animation
6. Preview carousel of all new avatars they'll unlock
7. "Begin your new journey" button
8. First avatar of new era animates in
9. Confetti + haptic buzz
10. Share to social button ("I just entered the Roman Era in GSTW")

**Frequency:** Rare (only 3 times in a user's lifetime). Makes them EPIC.

### Database Schema (When Implemented)
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS featured_badges TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_era TEXT DEFAULT 'hebrew';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_customization JSONB DEFAULT '{}';
