import { NextResponse } from 'next/server';
import type { Story } from '@/app/models/story';

// Configure to use Node.js runtime instead of Edge
export const runtime = 'nodejs';

// Direct fetch implementation for NewsAPI
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

interface NewsAPIArticle {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
}

export async function GET() {
  if (!NEWS_API_KEY) {
    console.error('NEWS_API_KEY is not configured');
    return NextResponse.json(
      { error: 'API configuration error' },
      { status: 500 }
    );
  }
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?language=en&pageSize=20`,
      {
        headers: {
          'X-Api-Key': NEWS_API_KEY,
        },
        // Required for NewsAPI to work
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`NewsAPI responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.articles) {
      throw new Error('Invalid response format from NewsAPI');
    }

    const stories = data.articles.map((article: NewsAPIArticle): Omit<Story, 'id' | 'predictions'> => ({
      title: article.title,
      description: article.description || '',
      url: article.url,
      publishedAt: article.publishedAt,
      source: {
        id: article.source.id,
        name: article.source.name || 'Unknown',
      },
    }));
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
