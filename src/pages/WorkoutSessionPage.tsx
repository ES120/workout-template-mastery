import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Play } from 'lucide-react';
import { EXERCISES } from '@/data/exercises';
import type { WorkoutTemplate, Exercise as ExerciseType, Workout, WorkoutExercise, WorkoutSet } from '@/types';

const workoutSetSchema = z.object({
  reps: z.coerce.number().min(1, "Min 1 rep."),
  weight: z.coerce.number().min(0, "Min 0 weight."),
  completed: z.boolean().default(false),
});

const workoutExerciseSchema = z.object({
  exerciseId: z.string().min(1, "Exercise is required."),
  sets: z.array(workoutSetSchema).min(1, "Add at least one set."),
  notes: z.string().optional(),
});

const workoutFormSchema = z.object({
  name: z.string().min(1, "Workout name is required."),
  exercises: z.array(workoutExerciseSchema),
  notes: z.string().optional(),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

const WorkoutSessionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workoutType, template, workoutName } = location.state || {};
  
  const [startTime] = useState(new Date());
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, {reps: number, weight: number}>>({});

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      name: workoutName || 'New Workout',
      exercises: template?.exercises?.map((ex: any) => ({
        exerciseId: ex.exercise.id,
        sets: ex.sets.map((s: any) => ({ reps: s.reps, weight: s.weight, completed: false })),
        notes: '',
      })) || [],
      notes: '',
    },
  });

  const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  // Load exercise history from localStorage (simulating database)
  useEffect(() => {
    const history = localStorage.getItem('exerciseHistory');
    if (history) {
      setExerciseHistory(JSON.parse(history));
    }
  }, []);

  const saveExerciseHistory = (exerciseId: string, reps: number, weight: number) => {
    const newHistory = { ...exerciseHistory, [exerciseId]: { reps, weight } };
    setExerciseHistory(newHistory);
    localStorage.setItem('exerciseHistory', JSON.stringify(newHistory));
  };

  const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    const currentSet = form.getValues(`exercises.${exerciseIndex}.sets.${setIndex}`);
    form.setValue(`exercises.${exerciseIndex}.sets.${setIndex}.completed`, !currentSet.completed);
    
    // Save to exercise history when set is completed
    if (!currentSet.completed) {
      const exerciseId = form.getValues(`exercises.${exerciseIndex}.exerciseId`);
      saveExerciseHistory(exerciseId, currentSet.reps, currentSet.weight);
    }
  };

  function onSubmit(data: WorkoutFormValues) {
    console.log("Workout data:", data);
    
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000); // duration in minutes

    const completedWorkout: Workout = {
      id: uuidv4(),
      name: data.name,
      date: new Date().toISOString(),
      duration,
      notes: data.notes,
      exercises: data.exercises.map(ex => {
        const foundExercise = EXERCISES.find(e => e.id === ex.exerciseId);
        if (!foundExercise) {
          throw new Error(`Exercise with id ${ex.exerciseId} not found`);
        }
        return {
          exercise: foundExercise,
          sets: ex.sets.map(s => ({
            reps: s.reps,
            weight: s.weight,
            completed: s.completed,
          })) as WorkoutSet[],
          notes: ex.notes,
        };
      }),
    };

    console.log("Completed workout:", completedWorkout);
    
    // Save workout to history and navigate back
    navigate('/workouts', { 
      state: { 
        completedWorkout 
      } 
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Workout Session</h2>
          <p className="text-sm text-muted-foreground">Started at {startTime.toLocaleTimeString()}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/new-workout">Back</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Workout" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="text-lg font-medium mb-3">Exercises</h3>
            {exerciseFields.map((field, exerciseIndex) => (
              <WorkoutExerciseCard 
                key={field.id}
                exerciseIndex={exerciseIndex}
                control={form.control}
                onRemove={() => removeExercise(exerciseIndex)}
                onToggleSet={toggleSetCompleted}
                exerciseHistory={exerciseHistory}
              />
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => appendExercise({ 
                exerciseId: '', 
                sets: [{ reps: 8, weight: 0, completed: false }],
                notes: '' 
              })}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Exercise
            </Button>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout Notes (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="How did the workout feel?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg">
            <Save className="mr-2 h-4 w-4" /> Finish Workout
          </Button>
        </form>
      </Form>
    </div>
  );
};

const WorkoutExerciseCard = ({ 
  exerciseIndex, 
  control, 
  onRemove, 
  onToggleSet,
  exerciseHistory 
}: { 
  exerciseIndex: number; 
  control: any; 
  onRemove: () => void;
  onToggleSet: (exerciseIndex: number, setIndex: number) => void;
  exerciseHistory: Record<string, {reps: number, weight: number}>;
}) => {
  const { fields: setFields, append: appendSet, remove: removeSet } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  const exerciseId = control._formValues.exercises[exerciseIndex]?.exerciseId;
  const lastPerformance = exerciseHistory[exerciseId];

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Exercise {exerciseIndex + 1}</CardTitle>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name={`exercises.${exerciseIndex}.exerciseId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Exercise</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an exercise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXERCISES.map((ex: ExerciseType) => (
                    <SelectItem key={ex.id} value={ex.id}>
                      {ex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {lastPerformance && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            Last: {lastPerformance.reps} reps @ {lastPerformance.weight}kg
          </div>
        )}
        
        <div className="space-y-3">
          <FormLabel>Sets</FormLabel>
          {setFields.map((setField, setIndex) => (
            <WorkoutSetRow
              key={setField.id}
              exerciseIndex={exerciseIndex}
              setIndex={setIndex}
              control={control}
              onRemove={() => removeSet(setIndex)}
              onToggleCompleted={() => onToggleSet(exerciseIndex, setIndex)}
            />
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => appendSet({ reps: 8, weight: 0, completed: false })}
          >
            <Plus className="mr-2 h-3 w-3" /> Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const WorkoutSetRow = ({ 
  exerciseIndex, 
  setIndex, 
  control, 
  onRemove, 
  onToggleCompleted 
}: { 
  exerciseIndex: number; 
  setIndex: number; 
  control: any; 
  onRemove: () => void;
  onToggleCompleted: () => void;
}) => {
  const isCompleted = control._formValues.exercises[exerciseIndex]?.sets[setIndex]?.completed || false;

  return (
    <div className={`flex items-end space-x-2 p-3 border rounded-md ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
      <FormField
        control={control}
        name={`exercises.${exerciseIndex}.sets.${setIndex}.reps`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel className="text-xs">Reps</FormLabel>
            <FormControl>
              <Input type="number" placeholder="8" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`exercises.${exerciseIndex}.sets.${setIndex}.weight`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormLabel className="text-xs">Weight (kg)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="10" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button 
        type="button" 
        variant={isCompleted ? "default" : "outline"} 
        size="icon" 
        onClick={onToggleCompleted}
        className="shrink-0"
      >
        {isCompleted ? <Save className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="shrink-0">
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
};

export default WorkoutSessionPage;
