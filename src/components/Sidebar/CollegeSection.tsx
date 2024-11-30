import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { CourseList } from './CourseList';
import type { College, Course } from '../../types';

interface CollegeSectionProps {
  college: College;
  courses: Course[];
  activeDragId: string | null;
  isSelected: boolean;
  onSelect: () => void;
}

export const CollegeSection: React.FC<CollegeSectionProps> = ({
  college,
  courses,
  activeDragId,
  isSelected,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
    onSelect();
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        className={`w-full p-3 text-left rounded-lg transition-colors flex items-center justify-between
          ${isSelected ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' : 'bg-white hover:bg-gray-50 border-2 border-gray-100'}`}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <div>
            <h3 className="font-medium">{college.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {courses.length} Courses
            </p>
          </div>
        </div>
      </button>
      
      {isExpanded && isSelected && (
        <div className="pl-4">
          <CourseList courses={courses} activeDragId={activeDragId} />
        </div>
      )}
    </div>
  );
};