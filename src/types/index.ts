
export interface MuscleGroup {
  id: string;
  name: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[]; // Can target multiple muscle groups
  description?: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO string
  exercises: WorkoutExercise[];
  duration?: number; // in minutes
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Pick<WorkoutExercise, 'exercise' | 'sets'>[]; // Template sets might be target reps/weight
}

