import { StoryManager } from "@/app/models/story";
import styles from "../StoryDetail.module.css";

const storyManager = StoryManager.getInstance();

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return <div>Loading...</div>;
  }

  const story = storyManager.getStoryBySlug(slug);

  if (!story) {
    return <div>Story not found</div>;
  }

  return (
    <div className={styles.storyDetail}>
      <h1>{story.title}</h1>
      <div className={styles.storyMeta}>
        <span>{story.createdAt.toDateString()}</span>
        <span>{story.location}</span>
      </div>
      <div className={styles.storyContent}>{story.content}</div>
      <div className={styles.storyTopics}>
        {story.topics.map((topic: string, index: number) => (
          <span key={index} className={styles.storyTopic}>{topic}</span>
        ))}
      </div>
    </div>
  );
}
