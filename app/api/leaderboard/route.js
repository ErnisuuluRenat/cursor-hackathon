import { getPlayers } from '@/lib/store';

export async function GET() {
  const players = getPlayers();
  return Response.json({ players });
}
