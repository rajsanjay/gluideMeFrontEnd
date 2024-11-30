import React, { useState } from 'react';
import { AlertCircle, ChevronRight, ChevronDown } from 'lucide-react';
import type { Course } from '../../types';

interface UnmappedSectionProps {
  courses: Course[];
}

export const UnmappedSection: React.FC<UnmappedSectionProps> = ({ courses }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-3 text-left rounded-lg transition-colors flex items-center justify-between
          ${isExpanded ? 'bg-gray-100 text-gray-700 border-2 border-gray-200' : 'bg-white hover:bg-gray-50 border-2 border-gray-100'}`}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-gray-500" />
            <div>
              <h3 className="font-medium">Unmapped Courses</h3>
              <p className="text-sm text-gray-500 mt-1">
                {courses.length} Courses
              </p>
            </div>
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="pl-4 space-y-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-700">{course.name}</h3>
                <span className="text-sm font-mono px-2 py-1 rounded bg-gray-200 text-gray-600">
                  {course.code}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{course.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                {course.credits} credits • {course.department}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};