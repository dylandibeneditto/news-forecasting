import React from 'react';
import { Possibility } from '@/app/models/story';
import './PossibilityTree.css';

interface PossibilityTreeProps {
  possibilities: Possibility[];
}

export default function PossibilityTree({ possibilities }: PossibilityTreeProps) {
  if (!possibilities || possibilities.length === 0) {
    return <div className="empty-message">No possibilities available.</div>;
  }

  return (
    <div className="possibility-card">
      <h3 className="possibility-title">Possible Scenarios</h3>
      <div className="possibility-list">
        {possibilities.map((possibility, index) => (
          <div key={index} className="possibility-item">
            <div className="possibility-header">
              <h4 className="possibility-scenario">{possibility.scenario}</h4>
              <div className="possibility-probability">
                {possibility.probability}%
              </div>
            </div>
            
            <div className="consequences-section">
              <h5 className="consequences-title">Consequences:</h5>
              <ul className="consequences-list">
                {possibility.consequences.map((consequence: string, i: number) => (
                  <li key={i}>{consequence}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 