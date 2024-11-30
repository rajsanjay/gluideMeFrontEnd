import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { College, Course, ScheduleEvent, SearchFilters } from '../types';

interface ScheduleHistoryState {
  past: ScheduleEvent[][];
  present: ScheduleEvent[];
  future: ScheduleEvent[][];
}

interface StoreState {
  selectedCollege: College | null;
  selectedCourses: Course[];
  placedCourses: Course[];
  scheduleHistory: ScheduleHistoryState;
  searchFilters: SearchFilters;
  selectedEvent: ScheduleEvent | null;
  isDragging: boolean;
  setSelectedCollege: (college: College | null) => void;
  setSelectedCourses: (courses: Course[]) => void;
  toggleCourseSelection: (course: Course) => void;
  addPlacedCourse: (course: Course) => void;
  removePlacedCourse: (courseId: string) => void;
  clearPlacedCourses: () => void;
  setScheduleEvents: (events: ScheduleEvent[]) => void;
  addScheduleEvent: (event: ScheduleEvent) => void;
  removeScheduleEvent: (eventId: string) => void;
  updateScheduleEvent: (event: ScheduleEvent) => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  hasTimeConflict: (newEvent: Omit<ScheduleEvent, 'id'>) => boolean;
  undo: () => void;
  redo: () => void;
  setSelectedEvent: (event: ScheduleEvent | null) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const MAX_HISTORY_LENGTH = 50;

export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      selectedCollege: null,
      selectedCourses: [],
      placedCourses: [],
      scheduleHistory: {
        past: [],
        present: [],
        future: [],
      },
      searchFilters: {
        query: '',
        department: '',
        credits: null,
      },
      selectedEvent: null,
      isDragging: false,

      setSelectedCollege: (college) => set({ selectedCollege: college }),
      
      setSelectedCourses: (courses) => set({ selectedCourses: courses }),

      toggleCourseSelection: (course) =>
        set((state) => {
          const isSelected = state.selectedCourses.some((c) => c.id === course.id);
          return {
            selectedCourses: isSelected
              ? state.selectedCourses.filter((c) => c.id !== course.id)
              : [...state.selectedCourses, course],
          };
        }),

      addPlacedCourse: (course) =>
        set((state) => ({
          placedCourses: [...state.placedCourses, course],
          selectedCourses: state.selectedCourses.filter((c) => c.id !== course.id),
        })),

      removePlacedCourse: (courseId) =>
        set((state) => {
          const course = state.placedCourses.find((c) => c.id === courseId);
          if (!course) return state;
          return {
            placedCourses: state.placedCourses.filter((c) => c.id !== courseId),
            selectedCourses: [...state.selectedCourses, course],
          };
        }),

      clearPlacedCourses: () =>
        set((state) => ({
          placedCourses: [],
          selectedCourses: [...state.selectedCourses, ...state.placedCourses],
        })),

      setScheduleEvents: (events) =>
        set((state) => {
          const newPast = [
            ...state.scheduleHistory.past,
            state.scheduleHistory.present,
          ].slice(-MAX_HISTORY_LENGTH);

          return {
            scheduleHistory: {
              past: newPast,
              present: events,
              future: [],
            },
          };
        }),

      addScheduleEvent: (event) =>
        set((state) => {
          const newPresent = [...state.scheduleHistory.present, event];
          const newPast = [
            ...state.scheduleHistory.past,
            state.scheduleHistory.present,
          ].slice(-MAX_HISTORY_LENGTH);

          return {
            scheduleHistory: {
              past: newPast,
              present: newPresent,
              future: [],
            },
          };
        }),

      removeScheduleEvent: (eventId) =>
        set((state) => {
          const newPresent = state.scheduleHistory.present.filter(
            (e) => e.id !== eventId
          );
          const newPast = [
            ...state.scheduleHistory.past,
            state.scheduleHistory.present,
          ].slice(-MAX_HISTORY_LENGTH);

          return {
            scheduleHistory: {
              past: newPast,
              present: newPresent,
              future: [],
            },
          };
        }),

      updateScheduleEvent: (event) =>
        set((state) => {
          const newPresent = state.scheduleHistory.present.map((e) =>
            e.id === event.id ? event : e
          );
          const newPast = [
            ...state.scheduleHistory.past,
            state.scheduleHistory.present,
          ].slice(-MAX_HISTORY_LENGTH);

          return {
            scheduleHistory: {
              past: newPast,
              present: newPresent,
              future: [],
            },
          };
        }),

      updateSearchFilters: (filters) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters },
        })),

      hasTimeConflict: (newEvent) => {
        const { scheduleHistory } = get();
        return scheduleHistory.present.some(
          (event) =>
            newEvent.start < event.end && newEvent.end > event.start
        );
      },

      undo: () =>
        set((state) => {
          const { past, present, future } = state.scheduleHistory;
          if (past.length === 0) return state;

          const newPresent = past[past.length - 1];
          const newPast = past.slice(0, past.length - 1);
          const newFuture = [present, ...future];

          return {
            scheduleHistory: {
              past: newPast,
              present: newPresent,
              future: newFuture,
            },
          };
        }),

      redo: () =>
        set((state) => {
          const { past, present, future } = state.scheduleHistory;
          if (future.length === 0) return state;

          const newPresent = future[0];
          const newPast = [...past, present];
          const newFuture = future.slice(1);

          return {
            scheduleHistory: {
              past: newPast,
              present: newPresent,
              future: newFuture,
            },
          };
        }),

      setSelectedEvent: (event) => set({ selectedEvent: event }),
      setIsDragging: (isDragging) => set({ isDragging }),
    }),
    { name: 'schedule-store' }
  )
);