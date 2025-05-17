import { NextResponse } from 'next/server';
import type { Timeline } from '@/app/models/story';
import NodeCache from 'node-cache';

// Configure for Node.js runtime (required for OpenAI)
export const runtime = 'nodejs';

// Cache predictions for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storyId = searchParams.get('storyId');
  const title = searchParams.get('title');
  const description = searchParams.get('description');
  const tone = searchParams.get('tone') as Timeline['tone'];

  if (!storyId || !tone || !title) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Check cache first
    const cacheKey = `${storyId}-${tone}`;
    const cachedPredictions = cache.get(cacheKey);
    if (cachedPredictions) {
      return NextResponse.json(cachedPredictions);
    }

    // Validate the tone
    const validTones: Timeline['tone'][] = ['realistic', 'optimistic', 'dystopian'];
    if (!validTones.includes(tone)) {
      return NextResponse.json(
        { error: 'Invalid tone parameter. Must be one of: realistic, optimistic, dystopian' },
        { status: 400 }
      );
    }

    // Generate predictions using the prediction service directly
    const predictionService = await import('@/app/services/predictionService');
    const predictions = await predictionService.default.generatePredictions(
      { 
        id: storyId, 
        title, 
        description: description || '', 
        predictions: [],
        url: '',
        publishedAt: new Date().toISOString(),
        source: { id: null, name: '' }
      }, 
      tone
    );

    // Cache the predictions
    cache.set(cacheKey, predictions);
    
    return NextResponse.json(predictions);
  } catch (error) {
    console.error('Error generating predictions:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'OpenAI API configuration error' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
