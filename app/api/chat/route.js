import { callClaudeChat } from '@/lib/ai';
import { PLANNER_SYSTEM, extractPlanFromMessage } from '@/lib/planner';

export async function POST(request) {
  const { messages } = await request.json();

  try {
    const reply = await callClaudeChat(messages, PLANNER_SYSTEM);
    const plan = extractPlanFromMessage(reply);

    // Strip the <PLAN>...</PLAN> block from the visible message
    const visibleReply = reply.replace(/<PLAN>[\s\S]*?<\/PLAN>/, '').replace('PLAN_READY', '').trim();

    return Response.json({ reply: visibleReply, plan });
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json({ error: 'Failed to get response' }, { status: 500 });
  }
}
