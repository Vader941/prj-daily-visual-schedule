import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import Timeline from './Timeline';
import './App.css';

const STORAGE_KEY = 'visualScheduler.timeline';

const initialTaskLibrary = [
  {
    id: 'task-1',
    icon: '🛏️',
    label: 'Wake Up',
    defaultDuration: 15,
    color: '#d0f0fd'
  },
  {
    id: 'task-2',
    icon: '🪥',
    label: 'Brush Teeth',
    defaultDuration: 5,
    color: '#d5f5d0'
  },
  {
    id: 'task-3',
    icon: '🚿',
    label: 'Shower',
    defaultDuration: 10,
    color: '#cfd0ff'
  },
  // Add more tasks as needed...
];

function App() {
  const [taskLibrary, setTaskLibrary] = React.useState(initialTaskLibrary);
  const [timelineTasks, setTimelineTasks] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // 🟢 Load from storage once
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('Loaded from storage:', parsed);
        setTimelineTasks(parsed);
      } catch (e) {
        console.error('Failed to parse saved timeline:', e);
      }
    }
    setIsLoaded(true); // ✅ now we can safely allow saving
  }, []);

  // 🟢 Save to storage only after load
  React.useEffect(() => {
    if (isLoaded) {
      console.log('Saving to storage:', timelineTasks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timelineTasks));
    }
  }, [timelineTasks, isLoaded]);

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    if (source.droppableId === 'taskLibrary' && destination.droppableId === 'timeline') {
      const taskToAdd = taskLibrary[source.index];
      if (!taskToAdd) return;
      setTimelineTasks([...timelineTasks, taskToAdd.id]);
    }
  };

  return (
    <div className="App">
      <h1>🧩 Visual Daily Scheduler</h1>
      <p>Drag tasks from the library into your daily schedule below.</p>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="taskLibrary" direction="horizontal">
          {(provided) => (
            <div
              className="task-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
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

        <Timeline timelineTasks={timelineTasks} taskLibrary={taskLibrary} />
      </DragDropContext>
    </div>
  );
}

export default App;
