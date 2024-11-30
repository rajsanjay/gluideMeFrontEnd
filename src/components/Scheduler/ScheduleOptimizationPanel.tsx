import React, { useState } from 'react';
import { Clock, BarChart2, MapPin } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { SchedulePreferences, ScheduleRecommendation } from '../../types';
import { ScheduleOptimizer } from '../../services/scheduleOptimizer';

const DEFAULT_PREFERENCES: SchedulePreferences = {
  preferredStartTime: '09:00',
  preferredEndTime: '17:00',
  preferredDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  minimizeGaps: true,
  balanceLoad: true,
};

export const ScheduleOptimizationPanel: React.FC = () => {
  const { selectedCourses, setScheduleEvents } = useStore();
  const [preferences, setPreferences] = useState<SchedulePreferences>(DEFAULT_PREFERENCES);
  const [recommendations, setRecommendations] = useState<ScheduleRecommendation[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const generateSchedules = () => {
    setIsOptimizing(true);
    try {
      const optimizer = new ScheduleOptimizer(selectedCourses, preferences);
      const newRecommendations = optimizer.generateRecommendations(3);
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Failed to generate schedules:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const applySchedule = (recommendation: ScheduleRecommendation) => {
    setScheduleEvents(recommendation.events);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Schedule Optimization</h2>
        <button
          onClick={generateSchedules}
          disabled={isOptimizing || selectedCourses.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isOptimizing ? 'Optimizing...' : 'Generate Schedules'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Start Time</label>
            <input
              type="time"
              value={preferences.preferredStartTime}
              onChange={(e) =>
                setPreferences({ ...preferences, preferredStartTime: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred End Time</label>
            <input
              type="time"
              value={preferences.preferredEndTime}
              onChange={(e) =>
                setPreferences({ ...preferences, preferredEndTime: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Optimization Preferences</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.minimizeGaps}
                onChange={(e) =>
                  setPreferences({ ...preferences, minimizeGaps: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Minimize Gaps</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.balanceLoad}
                onChange={(e) =>
                  setPreferences({ ...preferences, balanceLoad: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Balance Course Load</span>
            </label>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-md font-medium text-gray-900">Recommended Schedules</h3>
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">
                        Score: {Math.round(recommendation.score.total * 100)}%
                      </span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {recommendation.reasoning.map((reason, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => applySchedule(recommendation)}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};