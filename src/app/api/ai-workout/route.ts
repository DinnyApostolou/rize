import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json();

    if (!goal) {
      return NextResponse.json({ error: 'Missing goal' }, { status: 400 });
    }

    const promptText = `You are a strength and conditioning coach specializing in basketball. Create a full 7-day workout plan for a basketball player whose goal is: "${goal}".

For each day provide:
- Day name (e.g. Monday)
- Focus area
- 4-5 specific exercises with sets, reps, and rest periods
- One coaching note for the day

Day 7 should always be active recovery. Make the plan progressive and realistic for a basketball player who also practices their sport. Format each day clearly with the day name as a header. Keep total response under 800 words.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: promptText }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ result: text });
  } catch (err) {
    console.error('AI Workout error:', err);
    return NextResponse.json({ error: 'Failed to generate workout plan' }, { status: 500 });
  }
}
