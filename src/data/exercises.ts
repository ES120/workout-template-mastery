
import type { Exercise } from "@/types";
import { MUSCLE_GROUPS } from "./muscleGroups";

const findMuscleGroup = (id: string) => MUSCLE_GROUPS.find(mg => mg.id === id)!;

export const EXERCISES: Exercise[] = [
  { id: "bench_press", name: "Bench Press", muscleGroups: [findMuscleGroup("chest"), findMuscleGroup("triceps"), findMuscleGroup("shoulders")] },
  { id: "squat", name: "Squat", muscleGroups: [findMuscleGroup("legs")] },
  { id: "deadlift", name: "Deadlift", muscleGroups: [findMuscleGroup("back"), findMuscleGroup("legs")] },
  { id: "overhead_press", name: "Overhead Press", muscleGroups: [findMuscleGroup("shoulders")] },
  { id: "pull_up", name: "Pull Up", muscleGroups: [findMuscleGroup("back"), findMuscleGroup("biceps")] },
  { id: "bicep_curl", name: "Bicep Curl", muscleGroups: [findMuscleGroup("biceps")] },
  { id: "tricep_pushdown", name: "Tricep Pushdown", muscleGroups: [findMuscleGroup("triceps")] },
  { id: "leg_press", name: "Leg Press", muscleGroups: [findMuscleGroup("legs")] },
  { id: "plank", name: "Plank", muscleGroups: [findMuscleGroup("abs")] },
];
