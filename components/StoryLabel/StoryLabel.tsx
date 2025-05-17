import "./StoryLabel.css";
import React from "react";
import { Story } from "@/app/models/story";
import TopicLabel from "@/components/TopicLabel/TopicLabel";
import Link from "next/link";

interface StoryLabelProps {
  story: Story;
}

const StoryLabel: React.FC<StoryLabelProps> = ({ story }) => {
  return (
    <Link href={`/story/${story.slug}`} passHref>
      <div className="story">
        <div className="story-title">{story.title}</div>
        <div className="story-topics">{
          story.topics.map((topic, index) => (
            <span key={index} className="story-topic">
              <TopicLabel topic={topic} />
            </span>
          ))
        }</div>
        <div className="story-content">{story.content}</div>
        {story.prediction && (
          <div className="story-prediction">
            <h4>AI Prediction:</h4>
            <p>{story.prediction}</p>
            {story.lastPredictionUpdate && (
              <small>Last updated: {story.lastPredictionUpdate.toLocaleDateString()}</small>
            )}
          </div>
        )}
        <div className="story-meta">
          <div className="story-date">{story.createdAt.toDateString()}</div>
          <div className="spacer"></div>
          {story.source && (
            <div className="story-source">
              Source: {story.source}
            </div>
          )}
          <div className="story-location">{story.location}</div>
        </div>
      </div>
    </Link>
  );
};

export default StoryLabel;