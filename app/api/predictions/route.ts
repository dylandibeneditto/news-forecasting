import { NextResponse } from 'next/server';
import { StoryManager } from '@/app/models/story';
import type { Timeline } from '@/app/models/story';

// Handle both GET and POST methods for flexibility
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storyId = searchParams.get('storyId');
  const tone = searchParams.get('tone') as Timeline['tone'];

  if (!storyId || !tone) {
    return NextResponse.json(
      { error: 'Missing storyId or tone parameter' },
      { status: 400 }
    );
  }

  try {
    const storyManager = StoryManager.getInstance();
    const predictions = await storyManager.generatePredictions(storyId, tone);
    return NextResponse.json(predictions);
  } catch (error) {
    console.error('Error generating predictions:', error);
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
