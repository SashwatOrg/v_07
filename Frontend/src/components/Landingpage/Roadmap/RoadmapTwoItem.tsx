import React from "react";

interface RoadmapItemProps {
  item: {
    roadmapTitle: string;
    title: string;
    info: JSX.Element | string;
  };
}

const RoadmapTwoItem: React.FC<RoadmapItemProps> = ({ item }) => {
  return (
    <div className="roadmap-item">
      <span className="roadmap-title">{item.roadmapTitle}</span>
      <div className="roadmap-content">
        <span className="dot"></span>
        <h4 className="title">{item.title}</h4>
        <p>{item.info}</p>
      </div>
    </div>
  );
};

export default RoadmapTwoItem;
