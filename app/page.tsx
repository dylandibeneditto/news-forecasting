"use client";
import { useEffect, useState } from "react";
import "./page.css";
import StoryLabel from "@/components/StoryLabel/StoryLabel";
import { StoryManager } from "@/app/models/story";

const storyManager = StoryManager.getInstance();

export default function Home() {
  const [stories, setStories] = useState(storyManager.getAllStories());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        await storyManager.fetchLatestStories();
        setStories(storyManager.getAllStories());
      } catch (err) {
        setError("Failed to fetch latest stories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
    
    // Refresh stories every 15 minutes
    const interval = setInterval(fetchStories, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <main>
        {loading && <div className="loading">Loading latest stories...</div>}
        {error && <div className="error">{error}</div>}
        {stories.map((story) => (
          <StoryLabel key={story.id} story={story} />
        ))}
      </main>
    </div>
  );
}
