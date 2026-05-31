import { generatePlan } from '@/lib/planner';

export async function POST(request) {
  const { activity, members } = await request.json();

  try {
    const plan = await generatePlan({ activity, members, location: 'current' });
    return Response.json({ plan });
  } catch (error) {
    console.error('Plan generation error:', error);
    return Response.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}
