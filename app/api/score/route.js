import { applyResult } from '@/lib/elo';
import { updatePlayer, getPlayers } from '@/lib/store';

export async function POST(request) {
  const { playerId, coolnessScore } = await request.json();

  try {
    const player = updatePlayer(playerId, {});
    if (!player) {
      return Response.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    const newElo = applyResult(player.elo, coolnessScore);
    updatePlayer(playerId, { elo: newElo, completedTrips: (player.completedTrips || 0) + 1 });

    const players = getPlayers();
    return Response.json({ players });
  } catch (error) {
    console.error('Score update error:', error);
    return Response.json(
      { error: 'Failed to update score' },
      { status: 500 }
    );
  }
}
