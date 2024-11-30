import React, { useEffect, useRef, useState } from 'react';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import { ConnectionManager } from '../../utils/connectionManager';
import { SemesterSection } from './SemesterSection';
import { TermSelector } from './TermSelector';
import type { Course, Connection, PlacedCourse, Semester } from '../../types';

const MAX_SEMESTERS = 8;

export const SequenceCanvas: React.FC = () => {
  const { addPlacedCourse, clearPlacedCourses } = useStore();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [selectedTerm, setSelectedTerm] = useState('semester');
  const canvasRef = useRef<HTMLDivElement>(null);
  const connectionManagerRef = useRef<ConnectionManager>(new ConnectionManager());

  const { setNodeRef } = useDroppable({
    id: 'sequence-canvas',
  });

  const addSemester = () => {
    if (semesters.length >= MAX_SEMESTERS) {
      toast.error('Maximum number of semesters reached');
      return;
    }

    setSemesters(prev => [
      ...prev,
      { id: prev.length + 1, courses: [] }
    ]);
    toast.success(`${selectedTerm} ${semesters.length + 1} added`);
  };

  useEffect(() => {
    const manager = connectionManagerRef.current;
    
    const drawConnections = async () => {
      try {
        await manager.drawConnections(
          connections,
          selectedConnection?.id || null,
          handleLineClick
        );
      } catch (error) {
        console.error('Error drawing connections:', error);
      }
    };

    const timer = setTimeout(drawConnections, 100);

    return () => {
      clearTimeout(timer);
      manager.destroy();
    };
  }, [connections, semesters, selectedConnection]);

  const handleConnectionStart = (courseId: string) => {
    setConnectingFrom(courseId);
  };

  const handleConnectionEnd = (targetId: string) => {
    if (connectingFrom && connectingFrom !== targetId) {
      // Check if connection already exists
      const connectionExists = connections.some(
        conn => (conn.from === connectingFrom && conn.to === targetId) ||
               (conn.from === targetId && conn.to === connectingFrom)
      );

      if (!connectionExists) {
        const newConnection: Connection = {
          id: uuidv4(),
          from: connectingFrom,
          to: targetId,
        };
        setConnections(prev => [...prev, newConnection]);
        toast.success('Connection created');
      } else {
        toast.error('Connection already exists');
      }
    }
    setConnectingFrom(null);
  };

  const handleLineClick = (connection: Connection) => {
    setSelectedConnection(connection);
    const confirmed = window.confirm('Do you want to delete this connection?');
    if (confirmed) {
      setConnections(prev => prev.filter(conn => conn.id !== connection.id));
      setSelectedConnection(null);
      toast.success('Connection removed');
    }
  };

  useDndMonitor({
    onDragEnd(event) {
      const { active, over } = event;
      if (!over || !active.data.current) return;

      const course = active.data.current as Course;
      const overId = over.id.toString();
      
      if (!overId.startsWith('semester-')) return;
      
      const semesterId = parseInt(overId.replace('semester-', ''));
      if (isNaN(semesterId)) return;
      
      if (semesters.some(sem => sem.courses.some(c => c.id === course.id))) {
        toast.error('Course already placed in a semester');
        return;
      }
      
      setSemesters(prev => prev.map(sem => {
        if (sem.id === semesterId) {
          return {
            ...sem,
            courses: [...sem.courses, { ...course, semesterId }]
          };
        }
        return sem;
      }));
      
      addPlacedCourse(course);
      toast.success('Course added to semester');
    },
  });

  const clearCanvas = () => {
    connectionManagerRef.current.clearLines();
    setConnections([]);
    setSemesters([]);
    setConnectingFrom(null);
    setSelectedConnection(null);
    clearPlacedCourses();
    toast.success('Canvas cleared');
  };

  const saveSequence = () => {
    const sequence = {
      semesters,
      dependencies: connections,
    };
    console.log('Saved sequence:', sequence);
    toast.success('Sequence saved successfully');
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
          >
            Clear Canvas
          </button>
          <button
            onClick={saveSequence}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Dependencies
          </button>
          <button
            onClick={addSemester}
            disabled={semesters.length >= MAX_SEMESTERS}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
          <TermSelector
            selectedTerm={selectedTerm}
            onTermChange={setSelectedTerm}
          />
        </div>
      </div>
      
      <div
        ref={(node) => {
          setNodeRef(node);
          canvasRef.current = node;
        }}
        className="w-full h-[calc(100vh-16rem)] bg-gray-50 rounded-lg overflow-hidden"
      >
        <div className="h-full flex">
          {semesters.map((semester) => (
            <SemesterSection
              key={semester.id}
              number={semester.id}
              courses={semester.courses}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              connectingFrom={connectingFrom}
            />
          ))}
        </div>
      </div>
    </div>
  );
};