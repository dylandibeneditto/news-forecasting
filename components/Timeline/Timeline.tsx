import React from 'react';
import { Timeline } from '@/app/models/story';
import './Timeline.css';

interface TimelineProps {
  predictions: Timeline[];
}

export default function TimelineView({ predictions }: TimelineProps) {
  return (
    <div className="timeline">
      {predictions.map((prediction, index) => (
        <div key={index} className="timeline-node">
          <div className="timeline-content">
            <div className="timeframe">{prediction.timeframe}</div>
            <h3>{prediction.title}</h3>
            <p>{prediction.summary}</p>
            <div className="probability">
              Probability: {prediction.probability}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
