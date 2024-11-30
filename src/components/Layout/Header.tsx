import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Course Scheduler</h1>
        </div>
        <nav className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
            Help
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Save Schedule
          </button>
        </nav>
      </div>
    </header>
  );
};