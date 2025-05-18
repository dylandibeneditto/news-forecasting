import type { Story } from '../models/story';

class NewsService {
  private static instance: NewsService;

  private constructor() {}

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  async getTopStories(): Promise<Omit<Story, 'id' | 'predictions'>[]> {
    try {
      const response = await fetch('/api/news', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const stories = await response.json();
      
      if (!Array.isArray(stories)) {
        throw new Error('Invalid response format from API');
      }

      return stories;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }
}

export default NewsService.getInstance();
