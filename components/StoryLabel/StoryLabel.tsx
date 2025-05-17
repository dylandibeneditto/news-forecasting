import React from 'react';
import type { Story } from '@/app/models/story';
import './StoryLabel.css';

interface StoryLabelProps {
  story: Story;
}

export default function StoryLabel({ story }: StoryLabelProps) {
  return (
    <div className="story-label">
      <h3 className="story-title">{story.title}</h3>
      {story.description && (
        <p className="story-description">{story.description}</p>
      )}
      <div className="story-meta">
        <span className="story-source">{story.source.name}</span>
        <span className="story-date">
          {new Date(story.publishedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>
      <a 
        href={story.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="story-link"
        onClick={(e) => e.stopPropagation()}
      >
        Read original article
      </a>
    </div>
  );
}
