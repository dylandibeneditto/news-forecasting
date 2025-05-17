import { v4 as uuidv4 } from "uuid";
import { NewsService } from "../services/newsService";
import { PredictionService } from "../services/predictionService";

export interface Story {
  id: string;
  title: string;
  content: string;
  topics: string[];
  location: string;
  createdAt: Date;
  slug: string;
  source?: string;
  url?: string;
  prediction?: string;
  lastPredictionUpdate?: Date;
}

export class StoryManager {
  private static instance: StoryManager;
  private stories: Story[] = [];
  private newsService: NewsService;
  private predictionService: PredictionService;

  private constructor() {
    this.newsService = NewsService.getInstance();
    this.predictionService = PredictionService.getInstance();
  }

  static getInstance(): StoryManager {
    if (!StoryManager.instance) {
      StoryManager.instance = new StoryManager();
    }
    return StoryManager.instance;
  }

  createStory(title: string, content: string, topics: string[], location: string): Story {
    const slug = this.generateSlug(title);
    const newStory: Story = {
      id: uuidv4(),
      title,
      content,
      createdAt: new Date(),
      topics,
      location,
      slug,
    };
    this.stories.push(newStory);
    return newStory;
  }

  getStoryBySlug(slug: string): Story | undefined {
    return this.stories.find((story) => story.slug === slug);
  }

  getAllStories(): Story[] {
    return this.stories;
  }

  async fetchLatestStories(): Promise<Story[]> {
    const articles = await this.newsService.getLatestStories();
    const newStories = await Promise.all(
      articles.map(async (article) => {
        const existingStory = this.stories.find(
          (s) => s.title === article.title || s.url === article.url
        );
        if (existingStory) return existingStory;

        const story = this.createStory(
          article.title,
          article.description || article.content,
          this.extractTopics(article.description || article.content),
          article.source?.country || "Unknown"
        );
        
        story.source = article.source?.name;
        story.url = article.url;
        
        // Generate prediction for the story
        story.prediction = await this.predictionService.predictTrend(
          article.title,
          article.description || article.content
        );
        story.lastPredictionUpdate = new Date();
        
        return story;
      })
    );

    return newStories;
  }

  async searchStories(query: string): Promise<Story[]> {
    const articles = await this.newsService.searchStories(query);
    return articles.map((article) => ({
      id: uuidv4(),
      title: article.title,
      content: article.description || article.content,
      topics: this.extractTopics(article.description || article.content),
      location: article.source?.country || "Unknown",
      createdAt: new Date(article.publishedAt),
      slug: this.generateSlug(article.title),
      source: article.source?.name,
      url: article.url
    }));
  }

  async updatePrediction(storyId: string): Promise<Story | undefined> {
    const story = this.stories.find((s) => s.id === storyId);
    if (!story) return undefined;

    story.prediction = await this.predictionService.predictTrend(
      story.title,
      story.content
    );
    story.lastPredictionUpdate = new Date();
    return story;
  }

  private extractTopics(content: string): string[] {
    // Simple topic extraction based on common categories
    const commonTopics = [
      "Technology",
      "Politics",
      "Business",
      "Health",
      "Science",
      "Sports",
      "Entertainment",
      "Environment"
    ];

    return commonTopics.filter(topic =>
      content.toLowerCase().includes(topic.toLowerCase())
    );
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
