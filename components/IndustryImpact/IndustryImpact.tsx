import React from 'react';
import { IndustryImpact as IndustryImpactType } from '@/app/models/story';
import './IndustryImpact.css';

interface IndustryImpactProps {
  industries: IndustryImpactType[];
}

export default function IndustryImpact({ industries }: IndustryImpactProps) {
  if (!industries || industries.length === 0) {
    return <div className="empty-message">No industry impact data available.</div>;
  }

  const sortedIndustries = [...industries].sort((a, b) => b.impact - a.impact);
  
  const totalImpact = sortedIndustries.reduce((sum, industry) => sum + industry.impact, 0);

  return (
    <div className="industry-card">
      <h3 className="industry-title">Industry Impact</h3>
      <div className="industry-list">
        {sortedIndustries.map((industry, index) => (
          <div key={index} className="industry-item">
            <div className="industry-header">
              <span className="industry-name">{industry.name}</span>
              <span className="industry-impact-label">
                {industry.impact}% impact
              </span>
            </div>
            <div className="industry-bar">
              <div 
                className="industry-progress" 
                style={{ width: `${industry.impact}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="industry-chart">
        <div className="chart-container">
          {sortedIndustries.map((industry, index) => {
            const normalizedImpact = (industry.impact / totalImpact) * 100;
            
            const rotate = index > 0 
              ? sortedIndustries.slice(0, index).reduce((sum, ind) => sum + (ind.impact / totalImpact) * 100, 0) 
              : 0;
            
            return (
              <div
                key={index}
                className="chart-segment"
                style={{
                  background: `conic-gradient(transparent ${rotate}%, 
                               hsl(${280 - index * 30}, 70%, 60%) ${rotate}%, 
                               hsl(${280 - index * 30}, 70%, 60%) ${rotate + normalizedImpact}%, 
                               transparent ${rotate + normalizedImpact}%)`,
                }}
              />
            );
          })}
          <div className="chart-center">
            <div className="chart-label">
              Impact Distribution
            </div>
          </div>
        </div>
      </div>

      <div className="chart-legend">
        {sortedIndustries.map((industry, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ background: `hsl(${280 - index * 30}, 70%, 60%)` }}
            ></div>
            <span>{industry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 