import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const CalendarGrid: React.FC = () => {
  const startDate = startOfWeek(new Date());

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[4rem_repeat(5,1fr)] border-b">
        <div className="p-2 border-r"></div>
        {DAYS.map((day, i) => (
          <div key={day} className="p-2 text-center font-semibold border-r">
            <div>{day}</div>
            <div className="text-sm text-gray-500">
              {format(addDays(startDate, i + 1), 'MMM d')}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-[4rem_repeat(5,1fr)]">
        {HOURS.map((hour) => (
          <React.Fragment key={hour}>
            <div className="border-r border-b p-2 text-sm text-gray-500">
              {format(new Date().setHours(hour), 'ha')}
            </div>
            {DAYS.map((day) => (
              <div
                key={`${day}-${hour}`}
                className="border-r border-b p-2 min-h-[4rem]"
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};