// Simple ELO implementation for summer adventures
// Base ELO: 1200
// Gain: +10 per 10 coolness points (max +100 at coolness 100)

export function applyResult(currentElo, coolnessScore) {
  const eloGain = Math.ceil((coolnessScore / 10) * 10);
  return Math.max(800, currentElo + eloGain);
}

export function rankPlayers(players) {
  return players.sort((a, b) => b.elo - a.elo);
}
