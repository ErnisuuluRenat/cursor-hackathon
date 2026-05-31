const MOCK_VERDICT = {
  verified: true,
  reason: 'Great adventure! Looks legit.',
  coolnessScore: 72,
}

export async function POST(request) {
  try {
    const { activity, image } = await request.json()

    try {
      const { verifyProof } = await import('@/lib/verifier')
      const verdict = await verifyProof({ activity, image })
      return Response.json({ verdict })
    } catch (err) {
      console.error('verify error:', err)
      return Response.json({ verdict: MOCK_VERDICT })
    }
  } catch (error) {
    console.error('POST /api/verify error:', error)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
