import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { position, skillLevel } = await req.json();

    if (!position || !skillLevel) {
      return NextResponse.json({ error: 'Missing position or skillLevel' }, { status: 400 });
    }

    const promptText = `You are an elite basketball coach. A ${skillLevel} level ${position} (${getPositionName(position)}) player needs personalized drill recommendations.

Give them exactly 5 targeted drills. For each drill include:
- Drill name
- Duration/reps
- How to execute it (2-3 sentences)
- Why it specifically helps a ${position}

Format your response clearly with each drill numbered. Be specific, actionable, and motivating. Keep the total response under 600 words.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: promptText }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ result: text });
  } catch (err) {
    console.error('AI Coach error:', err);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}

function getPositionName(pos: string): string {
  const map: Record<string, string> = {
    PG: 'Point Guard',
    SG: 'Shooting Guard',
    SF: 'Small Forward',
    PF: 'Power Forward',
    C: 'Center',
  };
  return map[pos] || pos;
}
