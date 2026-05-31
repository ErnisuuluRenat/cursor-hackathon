import { getRoom } from '@/lib/store'

export async function GET() {
  try {
    return Response.json({ room: getRoom() })
  } catch (error) {
    console.error('GET /api/room error:', error)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
