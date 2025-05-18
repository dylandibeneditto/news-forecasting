import React from 'react';
import { Timeline } from '@/app/models/story';
import TrendPredictions from '../TrendPredictions/TrendPredictions';
import PossibilityTree from '../PossibilityTree/PossibilityTree';
import HistoricAnalogies from '../HistoricAnalogies/HistoricAnalogies';
import IndustryImpact from '../IndustryImpact/IndustryImpact';
import './Timeline.css';

interface TimelineViewProps {
  predictions: Timeline[];
}

export default function TimelineView({ predictions }: TimelineViewProps) {
  if (!predictions || predictions.length === 0) {
    return <div className="empty-message">No predictions available.</div>;
  }

  const timeframes = {
    '1month': predictions.find(p => p.timeframe === '1month'),
    '1year': predictions.find(p => p.timeframe === '1year'),
    '10years': predictions.find(p => p.timeframe === '10years')
  };

  const sharedPrediction = predictions[0];

  const getToneClass = (tone: Timeline['tone']): string => {
    switch (tone) {
      case 'optimistic': return 'tone-optimistic';
      case 'pessimistic': return 'tone-pessimistic';
      case 'dystopian': return 'tone-dystopian';
      default: return 'tone-neutral';
    }
  };

  const getTimeframeLabel = (key: string): string => {
    switch (key) {
      case '1month': return '1 Month';
      case '1year': return '1 Year';
      default: return '10 Year';
    }
  };

  return (
    <div className="timeline-container">
      <div className="shared-features-section">
        <h2 className="shared-features-title">Overall Analysis</h2>
        
        <div className="features-grid">
          <TrendPredictions trends={sharedPrediction.trends} />
          <PossibilityTree possibilities={sharedPrediction.possibilities} />
          <HistoricAnalogies analogies={sharedPrediction.historicAnalogies} />
          <IndustryImpact industries={sharedPrediction.impactedIndustries} />
        </div>
      </div>
      
      <div className="timeframes-section">
        <h2 className="timeframes-title">Specific Timeframe Predictions</h2>
        
        {Object.entries(timeframes).map(([key, prediction]) => 
          prediction ? (
            <div key={key} className="timeframe-section">
              <div className="timeframe-header">
                <span className="timeframe-title">
                  {getTimeframeLabel(key)} Prediction
                </span>
                <span className={`timeframe-badge ${getToneClass(prediction.tone)}`}>
                  {prediction.tone.charAt(0).toUpperCase() + prediction.tone.slice(1)} View
                </span>
              </div>
              
              <div className="timeframe-summary">
                <h3 className="summary-title">{prediction.title}</h3>
                <p className="summary-text">{prediction.summary}</p>
                <div className="probability-badge">
                  Probability: {prediction.probability}%
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
} 