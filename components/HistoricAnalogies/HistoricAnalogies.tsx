import React from 'react';
import { HistoricAnalogy } from '@/app/models/story';
import './HistoricAnalogies.css';

interface HistoricAnalogiesProps {
  analogies: HistoricAnalogy[];
}

export default function HistoricAnalogies({ analogies }: HistoricAnalogiesProps) {
  if (!analogies || analogies.length === 0) {
    return <div className="empty-message">No historical analogies available.</div>;
  }

  return (
    <div className="analogies-card">
      <h3 className="analogies-title">Historical Analogies</h3>
      <div className="analogies-list">
        {analogies.map((analogy, index) => (
          <div key={index} className="analogy-item">
            <div className="analogy-header">
              <h4 className="analogy-event">{analogy.event}</h4>
              <div className="analogy-year">
                {analogy.year}
              </div>
            </div>
            
            <div className="similarity-bar-container">
              <div className="similarity-bar">
                <div 
                  className="similarity-progress" 
                  style={{ width: `${analogy.similarity}%` }}
                ></div>
              </div>
              <div className="similarity-percentage">{analogy.similarity}% similar</div>
            </div>
            
            <p className="analogy-lessons">{analogy.lessons}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 