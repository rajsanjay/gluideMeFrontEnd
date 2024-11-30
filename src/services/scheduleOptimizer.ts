import { addMinutes, parse, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type {
  Course,
  ScheduleEvent,
  SchedulePreferences,
  ScheduleRecommendation,
  ScheduleScore,
} from '../types';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => 
  format(parse(`${i}:00`, 'H:mm', new Date()), 'HH:mm')
);

export class ScheduleOptimizer {
  private courses: Course[];
  private preferences: SchedulePreferences;

  constructor(courses: Course[], preferences: SchedulePreferences) {
    this.courses = courses;
    this.preferences = preferences;
  }

  generateRecommendations(count: number = 3): ScheduleRecommendation[] {
    const recommendations: ScheduleRecommendation[] = [];
    const baseSchedule = this.generateBaseSchedule();

    // Generate variations of the base schedule
    for (let i = 0; i < count; i++) {
      const events = this.optimizeSchedule(baseSchedule, i);
      const score = this.calculateScheduleScore(events);
      const reasoning = this.generateReasoning(events, score);

      recommendations.push({
        id: uuidv4(),
        events,
        score,
        reasoning,
      });
    }

    return recommendations.sort((a, b) => b.score.total - a.score.total);
  }

  private generateBaseSchedule(): ScheduleEvent[] {
    const events: ScheduleEvent[] = [];
    const coursesWithPreferred = this.courses.filter(c => c.preferredTimes?.length);
    const coursesWithoutPreferred = this.courses.filter(c => !c.preferredTimes?.length);

    // First, schedule courses with preferred times
    coursesWithPreferred.forEach(course => {
      course.preferredTimes?.forEach(pref => {
        events.push({
          id: uuidv4(),
          courseId: course.id,
          title: `${course.code} - ${course.name}`,
          start: this.createDateTime(pref.day, pref.startTime),
          end: this.createDateTime(pref.day, pref.endTime),
          color: course.color,
          location: course.location,
        });
      });
    });

    // Then, distribute remaining courses across available slots
    coursesWithoutPreferred.forEach(course => {
      const availableSlots = this.findAvailableTimeSlots(events);
      if (availableSlots.length) {
        const slot = this.selectOptimalTimeSlot(availableSlots);
        events.push({
          id: uuidv4(),
          courseId: course.id,
          title: `${course.code} - ${course.name}`,
          start: slot.start,
          end: addMinutes(slot.start, 90), // Default 1.5 hour slots
          color: course.color,
          location: course.location,
        });
      }
    });

    return events;
  }

  private optimizeSchedule(baseEvents: ScheduleEvent[], variation: number): ScheduleEvent[] {
    const optimizedEvents = [...baseEvents];
    
    // Apply different optimization strategies based on variation
    switch (variation) {
      case 0: // Minimize gaps
        return this.minimizeGaps(optimizedEvents);
      case 1: // Balance load
        return this.balanceLoad(optimizedEvents);
      case 2: // Optimize for preferred times
        return this.optimizeForPreferredTimes(optimizedEvents);
      default:
        return optimizedEvents;
    }
  }

  private calculateScheduleScore(events: ScheduleEvent[]): ScheduleScore {
    const breakdown = {
      timePreference: this.scoreTimePreferences(events),
      gapOptimization: this.scoreGapOptimization(events),
      loadBalance: this.scoreLoadBalance(events),
      travelTime: this.scoreTravelTime(events),
    };

    return {
      total: Object.values(breakdown).reduce((sum, score) => sum + score, 0) / 4,
      breakdown,
    };
  }

  private generateReasoning(events: ScheduleEvent[], score: ScheduleScore): string[] {
    const reasoning: string[] = [];

    if (score.breakdown.timePreference > 0.7) {
      reasoning.push('Matches well with preferred time slots');
    }

    if (score.breakdown.gapOptimization > 0.7) {
      reasoning.push('Minimizes gaps between classes');
    }

    if (score.breakdown.loadBalance > 0.7) {
      reasoning.push('Course load is well balanced throughout the week');
    }

    if (score.breakdown.travelTime > 0.7) {
      reasoning.push('Optimizes travel time between classes');
    }

    return reasoning;
  }

  // Helper methods
  private createDateTime(day: string, time: string): Date {
    const dayIndex = DAYS.indexOf(day);
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private findAvailableTimeSlots(events: ScheduleEvent[]) {
    // Implementation for finding available time slots
    return [];
  }

  private selectOptimalTimeSlot(slots: any[]) {
    // Implementation for selecting optimal time slot
    return { start: new Date(), end: new Date() };
  }

  private minimizeGaps(events: ScheduleEvent[]): ScheduleEvent[] {
    // Implementation for minimizing gaps
    return events;
  }

  private balanceLoad(events: ScheduleEvent[]): ScheduleEvent[] {
    // Implementation for balancing load
    return events;
  }

  private optimizeForPreferredTimes(events: ScheduleEvent[]): ScheduleEvent[] {
    // Implementation for preferred times optimization
    return events;
  }

  private scoreTimePreferences(events: ScheduleEvent[]): number {
    // Implementation for scoring time preferences
    return 0.8;
  }

  private scoreGapOptimization(events: ScheduleEvent[]): number {
    // Implementation for scoring gap optimization
    return 0.8;
  }

  private scoreLoadBalance(events: ScheduleEvent[]): number {
    // Implementation for scoring load balance
    return 0.8;
  }

  private scoreTravelTime(events: ScheduleEvent[]): number {
    // Implementation for scoring travel time
    return 0.8;
  }
}