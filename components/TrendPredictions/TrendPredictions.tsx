import React from 'react';
import { Trend } from '@/app/models/story';
import './TrendPredictions.css';

interface TrendPredictionsProps {
  trends: Trend[];
}

export default function TrendPredictions({ trends }: TrendPredictionsProps) {
  if (!trends || trends.length === 0) {
    return <div className="empty-message">No trend predictions available.</div>;
  }

  return (
    <div className="trend-card">
      <h3 className="trend-title">Economic & Social Trends</h3>
      <div className="trend-grid">
        {trends.map((trend, index) => (
          <div key={index} className="trend-item">
            <div className="trend-info">
              <div className="trend-name">{trend.name}</div>
              <div className="trend-value">{trend.value}% change</div>
            </div>
            <div className={`trend-icon trend-${trend.direction}`}>
              {trend.direction === 'up' && (
                <span>↑</span>
              )}
              {trend.direction === 'down' && (
                <span>↓</span>
              )}
              {trend.direction === 'stable' && (
                <span>→</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 