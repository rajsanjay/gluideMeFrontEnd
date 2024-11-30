import React, { useCallback, useRef } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import { EventModal } from './EventModal';
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { ScheduleEvent } from '../../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const EnhancedCalendar: React.FC = () => {
  const {
    scheduleHistory,
    selectedEvent,
    isDragging,
    removeScheduleEvent,
    updateScheduleEvent,
    setSelectedEvent,
    setIsDragging,
    hasTimeConflict,
  } = useStore();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const sensors = useSensors(mouseSensor);
  const calendarRef = useRef<any>(null);

  const handleEventDrop = useCallback(
    ({ event, start, end }: { event: ScheduleEvent; start: Date; end: Date }) => {
      const updatedEvent = { ...event, start, end };
      
      if (hasTimeConflict(updatedEvent)) {
        toast.error('Time slot conflict detected!');
        return;
      }

      updateScheduleEvent(updatedEvent);
      toast.success('Event updated successfully');
    },
    [updateScheduleEvent, hasTimeConflict]
  );

  const handleEventResize = useCallback(
    ({ event, start, end }: { event: ScheduleEvent; start: Date; end: Date }) => {
      const updatedEvent = { ...event, start, end };
      
      if (hasTimeConflict(updatedEvent)) {
        toast.error('Time slot conflict detected!');
        return;
      }

      updateScheduleEvent(updatedEvent);
      toast.success('Event duration updated');
    },
    [updateScheduleEvent, hasTimeConflict]
  );

  const eventStyleGetter = useCallback(
    (event: ScheduleEvent) => ({
      style: {
        backgroundColor: event.color,
        borderRadius: '4px',
        opacity: isDragging ? 0.5 : 0.8,
        color: 'white',
        border: 'none',
        cursor: 'move',
      },
    }),
    [isDragging]
  );

  return (
    <DndContext sensors={sensors}>
      <motion.div
        className="h-[calc(100vh-12rem)] bg-white rounded-lg shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={() => useStore.getState().undo()}
            disabled={scheduleHistory.past.length === 0}
            className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Undo
          </button>
          <button
            onClick={() => useStore.getState().redo()}
            disabled={scheduleHistory.future.length === 0}
            className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Redo
          </button>
        </div>

        <Calendar
          ref={calendarRef}
          localizer={localizer}
          events={scheduleHistory.present}
          defaultView={Views.WEEK}
          views={[Views.WEEK]}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 20, 0, 0)}
          step={30}
          timeslots={2}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={setSelectedEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          resizable
          selectable
          dayLayoutAlgorithm="no-overlap"
          tooltipAccessor={(event) => `${event.title}\nLocation: ${event.location || 'TBD'}`}
        />
      </motion.div>

      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onDelete={() => {
              removeScheduleEvent(selectedEvent.id);
              setSelectedEvent(null);
              toast.success('Event removed from schedule');
            }}
          />
        )}
      </AnimatePresence>
      <DragOverlay />
    </DndContext>
  );
};