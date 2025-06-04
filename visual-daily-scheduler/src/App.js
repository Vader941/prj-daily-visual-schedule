import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import TimeGrid from './TimeGrid';
import './App.css';

const STORAGE_KEY = 'visualScheduler.timeline';

const initialTaskLibrary = [
  { id: 'task-1', icon: '🛏️', label: 'Wake Up', defaultDuration: 15, color: '#d0f0fd' },
  { id: 'task-2', icon: '🪥', label: 'Brush Teeth', defaultDuration: 5, color: '#d5f5d0' },
  { id: 'task-3', icon: '🚿', label: 'Shower', defaultDuration: 10, color: '#cfd0ff' },
  { id: 'task-4', icon: '🥣', label: 'Eat Breakfast', defaultDuration: 20, color: '#fff0c2' },
  { id: 'task-5', icon: '🎒', label: 'Pack Bag', defaultDuration: 5, color: '#ffe3e3' },
  { id: 'task-6', icon: '🚌', label: 'Go to School', defaultDuration: 30, color: '#ffe5fa' },
  { id: 'task-7', icon: '📚', label: 'Study Time', defaultDuration: 45, color: '#f4f0ff' },
  { id: 'task-8', icon: '🍽️', label: 'Lunch', defaultDuration: 30, color: '#fff0f0' },
  { id: 'task-9', icon: '🏃', label: 'Exercise', defaultDuration: 30, color: '#dfffdc' },
  { id: 'task-10', icon: '🧩', label: 'Play Time', defaultDuration: 30, color: '#fceaff' },
  { id: 'task-11', icon: '🧘', label: 'Quiet Time', defaultDuration: 20, color: '#e6f2ff' },
  { id: 'task-12', icon: '📱', label: 'Tablet Time', defaultDuration: 30, color: '#fdf5e6' },
  { id: 'task-13', icon: '🛁', label: 'Bath', defaultDuration: 15, color: '#e3f7ff' },
  { id: 'task-14', icon: '📺', label: 'TV Time', defaultDuration: 30, color: '#f9e0e0' },
  { id: 'task-15', icon: '🍽️', label: 'Dinner', defaultDuration: 30, color: '#fff3db' },
  { id: 'task-16', icon: '📖', label: 'Story Time', defaultDuration: 15, color: '#e8ddff' },
  { id: 'task-17', icon: '🛏️', label: 'Go to Bed', defaultDuration: 10, color: '#ccddee' },
];

function App() {
  const [taskLibrary] = React.useState(initialTaskLibrary);
  const [timelineTasks, setTimelineTasks] = React.useState([]);
  const [draggingTaskId, setDraggingTaskId] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimelineTasks(parsed);
      } catch (e) {
        console.error('Failed to parse saved timeline:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timelineTasks));
    }
  }, [timelineTasks, isLoaded]);

  const isSlotRangeAvailable = (startIndex, duration, excludeId = null) => {
    const blocks = Math.ceil(duration / 15);
    for (let i = startIndex; i < startIndex + blocks; i++) {
      if (timelineTasks.some(t => {
        const tBlocks = Math.ceil(t.duration / 15);
        if (excludeId && t.id === excludeId && t.index === startIndex) return false;
        return i >= t.index && i < t.index + tBlocks;
      })) {
        return false;
      }
    }
    return true;
  };

  const handleDeleteTask = (taskId, index) => {
    setTimelineTasks((prev) => prev.filter((task) => !(task.id === taskId && task.index === index)));
  };

  const handleOnDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceSlot = source.droppableId;
    const destSlot = destination.droppableId;
    const destIndex = parseInt(destSlot);

    const taskFromLibrary = taskLibrary.find(t => t.id === draggableId);
    const existing = timelineTasks.find(t => t.id === draggableId && t.index === parseInt(sourceSlot));
    const task = taskFromLibrary || existing;
    if (!task) return;

    const duration = task.defaultDuration || task.duration;

    if (!isSlotRangeAvailable(destIndex, duration, task.id)) return;

    if (source.droppableId === 'taskLibrary') {
      setTimelineTasks(prev => [...prev, { ...task, index: destIndex, duration }]);
    } else {
      setTimelineTasks(prev =>
        prev.map(t => (t.id === task.id && t.index === parseInt(sourceSlot) ? { ...t, index: destIndex } : t))
      );
    }
  };

  return (
    <div className="App">
      <h1>🧩 Visual Daily Scheduler</h1>
      <button
        onClick={() => {
          if (window.confirm('Clear the entire timeline?')) {
            setTimelineTasks([]);
            localStorage.removeItem(STORAGE_KEY);
          }
        }}
        className="clear-button"
      >
        🗑️ Clear Timeline
      </button>

      <DragDropContext
        onDragStart={(start) => setDraggingTaskId(start.draggableId)}
        onDragEnd={(result) => {
          handleOnDragEnd(result);
          setDraggingTaskId(null);
        }}
      >
        <Droppable droppableId="taskLibrary" direction="horizontal">
          {(provided) => (
            <div className="task-container" ref={provided.innerRef} {...provided.droppableProps}>
              {taskLibrary.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard icon={task.icon} label={task.label} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <div className="time-grid-container">
          <TimeGrid
            scheduledTasks={timelineTasks}
            taskLibrary={taskLibrary}
            draggingTaskId={draggingTaskId}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;