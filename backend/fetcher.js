import { getPlayers, writeStats } from './storage.js';

const OVERFAST_BASE_URL = 'https://overfast-api.tekrop.fr';

// ─── Fetch a single player's profile summary (username, avatar, rank, etc.) ──

async function fetchPlayerSummary(battletag) {
  const url = `${OVERFAST_BASE_URL}/players/${battletag}/summary`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch summary for ${battletag}: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// ─── Fetch a single player's stats summary (performance, roles, heroes) ──────

async function fetchPlayerStats(battletag) {
  const url = `${OVERFAST_BASE_URL}/players/${battletag}/stats/summary`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch stats for ${battletag}: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// ─── Merge profile and stats into one clean object ───────────────────────────

function mergePlayerData(summary, stats) {
  return {
    // Profile
    username:    summary.username,
    avatar:      summary.avatar,
    title:       summary.title,
    endorsement: summary.endorsement,

    // Competitive ranks (pc and console, frontend handles null platforms)
    competitive: summary.competitive,

    // Performance stats
    general: stats.general,
    roles:   stats.roles,
    heroes:  stats.heroes,

    // Timestamp
    fetchedAt: new Date().toISOString(),
  };
}

// ─── Fetch all tracked players and write results to stats.json ───────────────

export async function fetchAllPlayers() {
  const players = getPlayers();

  const results = {};
  const errors = [];

  for (const battletag of players) {
    try {
      console.log(`Fetching data for ${battletag}...`);

      const [summary, stats] = await Promise.all([
        fetchPlayerSummary(battletag),
        fetchPlayerStats(battletag),
      ]);

      results[battletag] = mergePlayerData(summary, stats);
      console.log(`Fetched data for ${battletag}`);
    } catch (err) {
      console.error(`Failed to fetch data for ${battletag}: ${err.message}`);
      errors.push({ battletag, error: err.message });
    }
  }

  writeStats(results);
  console.log(`\nDone. ${Object.keys(results).length} succeeded, ${errors.length} failed.`);

  return { results, errors };
}