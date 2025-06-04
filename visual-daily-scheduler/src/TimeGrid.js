import React from 'react';
import './TimeGrid.css';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

const startHour = 7;
const endHour = 21;
const interval = 15;
const slotsPerHour = 60 / interval;
const totalSlots = (endHour - startHour) * slotsPerHour;

const formatTime = (index) => {
  const totalMinutes = startHour * 60 + index * interval;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const TimeGrid = ({ scheduledTasks, draggingTaskId, onDeleteTask }) => {
  const morningSlots = Array.from({ length: totalSlots / 2 }, (_, i) => i);
  const afternoonSlots = Array.from({ length: totalSlots / 2 }, (_, i) => i + totalSlots / 2);

  const isSlotOccupied = (index) => {
    return scheduledTasks.some(task => {
      const durationBlocks = Math.ceil(task.duration / interval);
      const isDragging = task.id === draggingTaskId;
      return !isDragging && index >= task.index && index < task.index + durationBlocks;
    });
  };

  const renderSlot = (slotIndex) => {
    const occupied = isSlotOccupied(slotIndex);
    const scheduledTask = scheduledTasks.find(task => task.index === slotIndex);

    return (
      <div className="slot-row" key={slotIndex}>
        <div className="time-label">{formatTime(slotIndex)}</div>
        <Droppable droppableId={slotIndex.toString()} key={slotIndex}>
          {(provided, snapshot) => (
            <div
              className={`time-slot ${occupied ? 'slot-blocked' : ''} ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
              data-slot={slotIndex}
            >
              {scheduledTask && (
                <Draggable
                  draggableId={scheduledTask.id}
                  index={scheduledTask.index}
                >
                  {(provided) => (
                    <div
                      className="task-with-delete"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard
                        icon={scheduledTask.icon}
                        label={scheduledTask.label}
                        style={{
                          backgroundColor: scheduledTask.color || '#eee',
                          height: `${(scheduledTask.duration / interval) * 100}%`,
                        }}
                      />
                      <button
                        className="delete-button"
                        onClick={() => onDeleteTask(scheduledTask.id, scheduledTask.index)}
                        aria-label="Delete task"
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </Draggable>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className="time-grid-wrapper">
      <div className="time-grid">
        <div className="row-label">Morning</div>
        {morningSlots.map(renderSlot)}
      </div>
      <div className="time-grid">
        <div className="row-label">Afternoon</div>
        {afternoonSlots.map(renderSlot)}
      </div>
    </div>
  );
};

export default TimeGrid;