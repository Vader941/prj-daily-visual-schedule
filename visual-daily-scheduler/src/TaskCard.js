import React from 'react';
import './TaskCard.css';

function TaskCard({ icon, label }) {
  return (
    <div className="task-card">
      <div className="task-icon">{icon}</div>
      <div className="task-label">{label}</div>
    </div>
  );
}

export default TaskCard;
