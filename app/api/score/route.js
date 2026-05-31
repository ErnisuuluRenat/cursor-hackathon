import { getPlayers, updatePlayer } from '@/lib/store'

export async function POST(request) {
  try {
    const { playerId, coolnessScore } = await request.json()
    const player = updatePlayer(playerId, {})

    if (!player) {
      return Response.json({ error: 'Player not found' }, { status: 404 })
    }

    let newElo
    try {
      const { applyResult } = await import('@/lib/elo')
      newElo = await applyResult({ playerId, coolnessScore, elo: player.elo })
    } catch (err) {
      console.error('score error:', err)
      newElo = player.elo + Math.floor(coolnessScore / 10) * 10
    }

    updatePlayer(playerId, {
      elo: newElo,
      completedTrips: (player.completedTrips || 0) + 1,
    })

    return Response.json({ players: getPlayers() })
  } catch (error) {
    console.error('POST /api/score error:', error)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
