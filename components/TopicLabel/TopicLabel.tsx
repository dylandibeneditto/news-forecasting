import "./TopicLabel.css";

import React from "react";

const styleLookup: Record<string, string> = {
    "Finance": "attach_money",
    "Health": "health_and_safety",
    "Technology": "memory",
    "Sports": "sports_soccer",
    "Politics": "gavel",
    "Environment": "eco",
    "Education": "school",
    "Entertainment": "movie",
    "Science": "science",
    "Travel": "flight"
};

interface TopicLabelProps {
    topic: string;
}

const TopicLabel: React.FC<TopicLabelProps> = ({ topic }) => {
  return (
    
    <div className="topic-label">
        <div className="topic-icon">
           <span className="material-symbols-outlined">{styleLookup[topic] != undefined ? styleLookup[topic] : "tag"}</span> 
        </div>
        <div className="topic-title">
            {topic}
        </div>

    </div>
  );
};

export default TopicLabel;