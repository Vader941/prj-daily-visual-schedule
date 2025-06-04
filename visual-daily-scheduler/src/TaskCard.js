import React from 'react';
import './TaskCard.css';

/**
 * TaskCard component
 * Props:
 * - icon: emoji or icon representing the task
 * - label: text label for the task
 */
function TaskCard({ icon, label }) {
  return (
    <div className="task-card">
      {/* Icon for the task */}
      <div className="task-icon">{icon}</div>
      {/* Label for the task */}
      <div className="task-label">{label}</div>
    </div>
  );
}

export default TaskCard;
