"use client";

import { useEffect, useState, use } from 'react';
import { StoryManager } from '@/app/models/story';
import type { Story, Timeline } from '@/app/models/story';
import TimelineView from '@/components/Timeline/Timeline';
import Link from 'next/link';
import './page.css';

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [story, setStory] = useState<Story | null>(null);
  const [predictionTone, setPredictionTone] = useState<Timeline['tone']>('realistic');
  const [generatingPrediction, setGeneratingPrediction] = useState(false);
  const [error, setError] = useState('');

  // Tone descriptions
  const toneDescriptions = {
    realistic: "A balanced view based on current trends and data, showing the most likely outcome.",
    optimistic: "A positive perspective that focuses on potential opportunities and favorable developments.",
    pessimistic: "A cautious view that emphasizes potential risks and challenges ahead."
  };

  // Tone emojis
  const toneEmojis = {
    realistic: "🧠",
    optimistic: "🌟",
    pessimistic: "⚠️"
  };

  useEffect(() => {
    const storyManager = StoryManager.getInstance();
    const foundStory = storyManager.getStoryById(resolvedParams.id);
    if (foundStory) {
      setStory(foundStory);
    } else {
      setError('Story not found');
    }
  }, [resolvedParams.id]);

  const generatePredictions = async () => {
    if (!story) return;
    
    setGeneratingPrediction(true);
    try {
      const response = await fetch(
        `/api/predictions?` + new URLSearchParams({
          storyId: story.id,
          title: story.title,
          description: story.description || '',
          tone: predictionTone
        })
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate predictions');
      }

      const predictions = await response.json();
      setStory({ ...story, predictions });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate predictions");
      console.error(err);
    } finally {
      setGeneratingPrediction(false);
    }
  };

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h1>Error</h1>
          <p>{error}</p>
          <Link href="/" className="back-link">Back to stories</Link>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container">
        <div className="loading">Loading story...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href="/" className="back-link">Back to stories</Link>
      
      <article className="story-detail">
        <h1 className="story-title">{story.title}</h1>
        
        <div className="story-meta">
          <span className="story-source">{story.source.name}</span>
          <span className="story-date">
            {new Date(story.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        {story.description && (
          <p className="story-description">{story.description}</p>
        )}

        <a 
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="original-link"
        >
          Read Here
        </a>

        <section className="predictions-section">
          <h2>Future Predictions</h2>
          
          <div className="tone-selector">
            <p className="tone-selector-label">Choose a perspective:</p>
            <div className="tone-options">
              {(['realistic', 'optimistic', 'pessimistic'] as const).map((tone) => (
                <div 
                  key={tone}
                  className={`tone-option ${predictionTone === tone ? 'selected' : ''}`}
                  onClick={() => !generatingPrediction && setPredictionTone(tone)}
                >
                  <span className="tone-emoji">{toneEmojis[tone]}</span>
                  <span className="tone-name">{tone.charAt(0).toUpperCase() + tone.slice(1)}</span>
                </div>
              ))}
            </div>
            <div className="tone-description">
              {toneDescriptions[predictionTone as keyof typeof toneDescriptions]}
            </div>
          </div>
          
          <button
            onClick={generatePredictions}
            disabled={generatingPrediction}
            className="time-travel-btn"
          >
            {generatingPrediction ? 'Generating...' : '🚀 Time Travel'}
          </button>

          {generatingPrediction && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Analyzing the story and generating predictions...</p>
              <p className="text-sm text-gray-500">This may take up to 30 seconds.</p>
            </div>
          )}

          {!generatingPrediction && story.predictions.length > 0 && (
            <TimelineView predictions={story.predictions} />
          )}
        </section>
      </article>
    </div>
  );
} 