import dotenv from 'dotenv';
dotenv.config();
console.log("API Key:", process.env);
import NewsAPI from 'newsapi';
import NodeCache from 'node-cache';

// Initialize NewsAPI with your API key
const newsapi = new NewsAPI(process.env.NEWS_API_KEY || '');

// Initialize cache with 15 minutes standard TTL
const cache = new NodeCache({ stdTTL: 900 });

export class NewsService {
  private static instance: NewsService;

  private constructor() {}

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  async getLatestStories(categories: string[] = []): Promise<any[]> {
    const cacheKey = `stories-${categories.join('-')}`;
    const cachedStories = cache.get(cacheKey);
    
    if (cachedStories) {
      return cachedStories as any[];
    }

    try {
      const response = await newsapi.v2.topHeadlines({
        language: 'en',
        country: 'us',
        category: categories.length > 0 ? categories[0].toLowerCase() : undefined,
        pageSize: 10
      });

      cache.set(cacheKey, response.articles);
      return response.articles;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async searchStories(query: string): Promise<any[]> {
    const cacheKey = `search-${query}`;
    const cachedResults = cache.get(cacheKey);

    if (cachedResults) {
      return cachedResults as any[];
    }

    try {
      const response = await newsapi.v2.everything({
        q: query,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 10
      });

      cache.set(cacheKey, response.articles);
      return response.articles;
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }
}
