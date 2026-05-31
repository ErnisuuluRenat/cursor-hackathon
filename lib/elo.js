// Simple ELO-style rating for summer adventures.
//
// A coolness of 50 is "par" (no change). Above 50 you gain, below you lose,
// scaled by a K-factor. Epic trip (100) => +K, lame proof (0) => -K.
// Rating is floored at 800 so nobody bottoms out.

const BASELINE_COOLNESS = 50;
const K_FACTOR = 40;
const FLOOR = 800;

export function applyResult(currentElo, coolnessScore) {
  const clamped = Math.min(100, Math.max(0, Number(coolnessScore) || 0));
  const delta = Math.round((K_FACTOR * (clamped - BASELINE_COOLNESS)) / BASELINE_COOLNESS);
  return Math.max(FLOOR, Math.round(currentElo) + delta);
}

export function rankPlayers(players) {
  return [...players].sort((a, b) => b.elo - a.elo);
}
