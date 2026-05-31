import { getRoom } from '@/lib/store';

export async function GET() {
  const room = getRoom();
  return Response.json({ room });
}
