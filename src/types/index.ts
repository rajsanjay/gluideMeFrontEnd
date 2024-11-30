// ... existing types ...

export interface PlacedCourse extends Course {
  position: { x: number; y: number };
  semesterId?: number;
}

export interface Semester {
  id: number;
  courses: PlacedCourse[];
}

// ... rest of the types ...