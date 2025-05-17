import "./page.css";
import StoryLabel from "@/components/StoryLabel/StoryLabel";
import { StoryManager } from "@/app/models/story";

const storyManager = StoryManager.getInstance();

// Create a sample story if none exist
if (storyManager.getAllStories().length === 0) {
  storyManager.createStory(
    "Sample Story Title",
    "This is the content of the sample story. It demonstrates how our story system works.",
    ["Technology", "AI"],
    "USA"
  );
}

export default function Home() {
  const stories = storyManager.getAllStories();
  
  return (
    <div>
      <main>
        {stories.map((story) => (
          <StoryLabel key={story.id} story={story} />
        ))}
      </main>
    </div>
  );
}
