import { v4 as uuidv4 } from 'uuid';

export interface Story {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  predictions: Timeline[];
}

export interface Trend {
  name: string;
  direction: 'up' | 'down' | 'stable';
  value: number;
}

export interface Possibility {
  scenario: string;
  probability: number;
  consequences: string[];
}

export interface HistoricAnalogy {
  event: string;
  year: string;
  similarity: number;
  lessons: string;
}

export interface IndustryImpact {
  name: string;
  impact: number;
}

export interface Timeline {
  timeframe: '1month' | '1year' | '10years';
  title: string;
  summary: string;
  tone: 'realistic' | 'optimistic' | 'pessimistic';
  probability: number;
  trends: Trend[];
  possibilities: Possibility[];
  historicAnalogies: HistoricAnalogy[];
  impactedIndustries: IndustryImpact[];
}

export class StoryManager {
  private static instance: StoryManager;
  private stories: Story[] = [];
  private cache: { [key: string]: Story } = {};

  private constructor() {}

  static getInstance(): StoryManager {
    if (!StoryManager.instance) {
      StoryManager.instance = new StoryManager();
    }
    return StoryManager.instance;
  }

  getAllStories(): Story[] {
    return this.stories;
  }

  getStoryById(id: string): Story | undefined {
    return this.cache[id];
  }

  addStory(story: Omit<Story, 'id' | 'predictions'>): Story {
    const newStory: Story = {
      ...story,
      id: uuidv4(),
      predictions: []
    };
    this.stories.push(newStory);
    this.cache[newStory.id] = newStory;
    return newStory;
  }

  async fetchLatestStories(): Promise<void> {
    try {
      const newsService = await import('../services/newsService');
      const latestStories = await newsService.default.getTopStories();
      this.stories = latestStories.map(story => ({
        ...story,
        id: uuidv4(),
        predictions: []
      }));
      this.cache = {};
      this.stories.forEach(story => {
        this.cache[story.id] = story;
      });
    } catch (error) {
      console.error('Error fetching latest stories:', error);
      throw error;
    }
  }

  async generatePredictions(storyId: string, tone: Timeline['tone']): Promise<Timeline[]> {
    const story = this.cache[storyId];
    if (!story) throw new Error('Story not found');

    try {
      const predictionService = await import('../services/predictionService');
      const predictions = await predictionService.default.generatePredictions(story, tone);
      story.predictions = predictions;
      this.cache[storyId] = story;
      return predictions;
    } catch (error) {
      console.error('Error generating predictions:', error);
      throw error;
    }
  }
}
