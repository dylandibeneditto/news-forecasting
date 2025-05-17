"use client";
import { useEffect, useState } from "react";
import "./page.css";
import StoryLabel from "@/components/StoryLabel/StoryLabel";
import TimelineView from "@/components/Timeline/Timeline";
import { StoryManager } from "@/app/models/story";
import type { Story, Timeline } from "@/app/models/story";

const storyManager = StoryManager.getInstance();

export default function Home() {
  const [stories, setStories] = useState(storyManager.getAllStories());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [predictionTone, setPredictionTone] = useState<Timeline['tone']>('realistic');
  const [generatingPrediction, setGeneratingPrediction] = useState(false);

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

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
  };

  const generatePredictions = async () => {
    if (!selectedStory) return;
    
    setGeneratingPrediction(true);
    try {
      await storyManager.generatePredictions(selectedStory.id, predictionTone);
      setSelectedStory(storyManager.getStoryById(selectedStory.id) || null);
    } catch (err) {
      setError("Failed to generate predictions");
      console.error(err);
    } finally {
      setGeneratingPrediction(false);
    }
  };

  return (
    <div className="container">
      <main>
        <section className="stories-section">
          <h2>Trending Stories</h2>
          {loading && <div className="loading">Loading latest stories...</div>}
          {error && <div className="error">{error}</div>}
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => handleStorySelect(story)}
              className={`story-item ${selectedStory?.id === story.id ? 'selected' : ''}`}
            >
              <StoryLabel story={story} />
            </div>
          ))}
        </section>

        {selectedStory && (
          <section className="prediction-section">
            <h2>Future Predictions</h2>
            <div className="controls">
              <select
                value={predictionTone}
                onChange={(e) => setPredictionTone(e.target.value as Timeline['tone'])}
                disabled={generatingPrediction}
              >
                <option value="realistic">Realistic</option>
                <option value="optimistic">Optimistic</option>
                <option value="dystopian">Dystopian</option>
              </select>
              <button
                onClick={generatePredictions}
                disabled={generatingPrediction}
                className="time-travel-btn"
              >
                {generatingPrediction ? 'Generating...' : '🚀 Time Travel'}
              </button>
            </div>
            
            {selectedStory.predictions.length > 0 && (
              <TimelineView predictions={selectedStory.predictions} />
            )}
          </section>
        )}
      </main>
    </div>
  );
}
