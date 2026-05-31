import { getPlayers } from '@/lib/store'

export async function GET() {
  try {
    return Response.json({ players: getPlayers() })
  } catch (error) {
    console.error('GET /api/leaderboard error:', error)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
