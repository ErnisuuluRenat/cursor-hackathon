const MOCK_PLAN = {
  packingList: ['Water', 'Sunscreen', 'Backpack'],
  bestDay: 'Saturday',
  steps: ['Meet at 10am', 'Head to location', 'Adventure time!'],
}

export async function POST(request) {
  try {
    const { activity, members } = await request.json()

    try {
      const { generatePlan } = await import('@/lib/planner')
      const plan = await generatePlan({ activity, members })
      return Response.json({ plan })
    } catch (err) {
      console.error('plan error:', err)
      return Response.json({ plan: MOCK_PLAN })
    }
  } catch (error) {
    console.error('POST /api/plan error:', error)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
