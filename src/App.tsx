import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { EnhancedCalendar } from './components/Calendar/EnhancedCalendar';
import { ScheduleOptimizationPanel } from './components/Scheduler/ScheduleOptimizationPanel';
import { SequenceView } from './components/Sequence/SequenceView';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type Tab = 'sequence' | 'calendar';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sequence');
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={(event) => setActiveDragId(event.active.id as string)}
      onDragEnd={() => setActiveDragId(null)}
    >
      <div className="h-screen flex flex-col bg-gray-100">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar activeDragId={activeDragId} />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="mb-4 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('sequence')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'sequence'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Sequence
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'calendar'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Calendar
                </button>
              </nav>
            </div>

            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <ScheduleOptimizationPanel />
                <EnhancedCalendar />
              </div>
            )}

            {activeTab === 'sequence' && <SequenceView />}
          </main>
        </div>
        <DragOverlay>
          {activeDragId ? (
            <div
              className="p-4 bg-white rounded-lg shadow-lg border-2 border-blue-500"
              style={{
                width: '200px',
                transform: CSS.Transform.toString({
                  x: 0,
                  y: 0,
                  scaleX: 1.05,
                  scaleY: 1.05,
                }),
              }}
            >
              <div className="font-medium text-gray-900">Course</div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default App;