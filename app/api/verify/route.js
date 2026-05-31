import { verifyProof } from '@/lib/verifier';

export async function POST(request) {
  const { activity, image } = await request.json();

  try {
    const verdict = await verifyProof({ activity, imageBase64: image });
    return Response.json({ verdict });
  } catch (error) {
    console.error('Verification error:', error);
    return Response.json(
      { error: 'Failed to verify proof' },
      { status: 500 }
    );
  }
}
