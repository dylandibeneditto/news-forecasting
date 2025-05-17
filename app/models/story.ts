import { v4 as uuidv4 } from "uuid";

export interface Story {
  id: string;
  title: string;
  content: string;
  topics: string[];
  location: string;
  createdAt: Date;
  slug: string;
}

export class StoryManager {
  private static instance: StoryManager;
  private stories: Story[] = [];

  private constructor() {}

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
