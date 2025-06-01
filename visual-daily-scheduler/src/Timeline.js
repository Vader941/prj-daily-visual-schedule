import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import './Timeline.css';

/**
 * The Timeline component now receives `timelineTasks` as an array of task IDs,
 * and `taskLibrary` to look up the full task data.
 */
function Timeline({ timelineTasks, taskLibrary }) {
  // Function to find a task by its ID
  const findTaskById = (id) => taskLibrary.find((task) => task.id === id);

  return (
    <div className="timeline-wrapper">
      <h2>🕒 My Daily Schedule</h2>

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
              timelineTasks.map((taskId, index) => {
                const task = findTaskById(taskId);
                return task ? (
                  <div key={`${taskId}-${index}`}>
                    <TaskCard icon={task.icon} label={task.label} />
                  </div>
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
