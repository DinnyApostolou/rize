import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(_req: NextRequest) {
  try {
    const promptText = `You are a sports nutritionist specializing in basketball athletes. Give personalized nutrition tips for a basketball player looking to optimize their performance.

Cover these areas:
1. Pre-game fueling strategy
2. During-game hydration and quick energy
3. Post-game recovery nutrition
4. Daily diet principles for basketball players
5. One "pro tip" that most players overlook

Be specific, practical, and backed by sports science. Use clear formatting with numbered sections. Keep it under 500 words and make it feel like advice from a real high-performance coach.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: promptText }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ result: text });
  } catch (err) {
    console.error('AI Nutrition error:', err);
    return NextResponse.json({ error: 'Failed to generate nutrition tips' }, { status: 500 });
  }
}
