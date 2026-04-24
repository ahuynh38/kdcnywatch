// ─── Rank order for comparison ────────────────────────────────────────────────

const DIVISION_ORDER = [
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond',
  'master',
  'grandmaster',
  'champion',
];

function getDivisionScore(division) {
  const index = DIVISION_ORDER.indexOf(division?.toLowerCase());
  return index === -1 ? -1 : index;
}

// ─── Compare two rank objects and return the higher one ───────────────────────
// Each rank object looks like: { division, tier, rank_icon, role_icon, tier_icon }
// Lower tier number = higher rank (e.g. Master 1 > Master 5)

function higherRank(rankA, rankB) {
  if (!rankA) return rankB;
  if (!rankB) return rankA;

  const scoreA = getDivisionScore(rankA.division);
  const scoreB = getDivisionScore(rankB.division);

  if (scoreA !== scoreB) return scoreA > scoreB ? rankA : rankB;

  // Same division — compare tier (lower tier number = higher rank)
  return (rankA.tier ?? 5) <= (rankB.tier ?? 5) ? rankA : rankB;
}

// ─── Get the best rank per role across pc and console ─────────────────────────

export function getBestRanks(competitive) {
  if (!competitive) return { tank: null, damage: null, support: null, open: null };

  const pc = competitive.pc;
  const console = competitive.console;

  return {
    tank:    higherRank(pc?.tank,    console?.tank),
    damage:  higherRank(pc?.damage,  console?.damage),
    support: higherRank(pc?.support, console?.support),
    open:    higherRank(pc?.open,    console?.open),
  };
}