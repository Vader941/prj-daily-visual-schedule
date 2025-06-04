import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import './Timeline.css';

/**
 * Timeline component
 * Props:
 * - timelineTasks: array of task IDs representing the user's schedule
 * - taskLibrary: array of all available task objects (used to look up task details by ID)
 */
function Timeline({ timelineTasks, taskLibrary, onRemoveTask }) {

  // Helper function: find a task object in the library by its ID
  const findTaskById = (id) => taskLibrary.find((task) => task.id === id);

  return (
    <div className="timeline-wrapper">
      <h2>🕒 My Daily Schedule</h2>

      {/* Droppable area for the timeline (accepts tasks dragged from the library) */}
      <Droppable droppableId="timeline" direction="horizontal">
  {(provided) => (
    <div
      className="timeline"
      {...provided.droppableProps}
      ref={provided.innerRef}
    >
      {timelineTasks.length === 0 ? (
        <p className="placeholder">Drag tasks here to build your day</p>
      ) : (
        timelineTasks.map((entry, index) => {
  const task = findTaskById(entry.id);

          return task ? (
            <Draggable key={`${entry.id}-${index}`} draggableId={`${entry.id}-${index}`} index={index}>

              {(provided) => (
                <div
                  className="timeline-card-wrapper"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCard icon={task.icon} label={`${task.label} (${entry.duration} min)`} />

                  <button className="remove-button" onClick={() => onRemoveTask(index)}>🗑️</button>
                </div>
              )}
            </Draggable>
          ) : null;
        })
      )}
      {provided.placeholder}
    </div>
  )}
</Droppable>

    </div>
  );
}

export default Timeline;
