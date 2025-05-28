import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from 'lucide-react';
import { EXERCISES } from '@/data/exercises';
import type { WorkoutTemplate, Exercise as ExerciseType, WorkoutSet } from '@/types';

const templateExerciseSchema = z.object({
  exerciseId: z.string().min(1, "Exercise is required."),
  sets: z.array(
    z.object({
      reps: z.coerce.number().min(1, "Min 1 rep."),
      weight: z.coerce.number().min(0, "Min 0 weight."),
    })
  ).min(1, "Add at least one set."),
});

const templateFormSchema = z.object({
  name: z.string().min(1, "Template name is required."),
  description: z.string().optional(),
  exercises: z.array(templateExerciseSchema).min(1, "Add at least one exercise."),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

const NewTemplatePage = () => {
  const navigate = useNavigate();
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: '',
      description: '',
      exercises: [],
    },
  });

  const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  function onSubmit(data: TemplateFormValues) {
    console.log("Form data:", data);
    const newTemplate: WorkoutTemplate = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      exercises: data.exercises.map(ex => {
        const foundExercise = EXERCISES.find(e => e.id === ex.exerciseId);
        if (!foundExercise) {
          // This should ideally not happen if select is populated correctly
          throw new Error(`Exercise with id ${ex.exerciseId} not found`);
        }
        return {
          exercise: foundExercise,
          sets: ex.sets.map(s => ({ ...s, completed: false })), // Add completed flag for WorkoutSet type
        };
      }),
    };
    console.log("New template to be saved:", newTemplate);
    // Pass the new template to TemplatesPage via route state
    navigate('/templates', { state: { newTemplate } });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Create New Template</h2>
        <Button asChild variant="outline">
          <Link to="/templates">Back to Templates</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Full Body Strength" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="A brief description of this template" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="text-lg font-medium mb-2">Exercises</h3>
            {exerciseFields.map((field, exerciseIndex) => (
              <Card key={field.id} className="mb-4">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md">Exercise {exerciseIndex + 1}</CardTitle>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeExercise(exerciseIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
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
                  
                  <SetsFieldArray exerciseIndex={exerciseIndex} control={form.control} />

                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendExercise({ exerciseId: '', sets: [{ reps: 8, weight: 0 }] })}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Exercise
            </Button>
             {form.formState.errors.exercises && typeof form.formState.errors.exercises === 'object' && !Array.isArray(form.formState.errors.exercises) && (
                <p className="text-sm font-medium text-destructive mt-1">{form.formState.errors.exercises.message}</p>
            )}
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Template"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

// Helper component for sets field array to keep main component cleaner
const SetsFieldArray = ({ exerciseIndex, control }: { exerciseIndex: number, control: any }) => {
  const { fields: setFields, append: appendSet, remove: removeSet } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  return (
    <div className="space-y-3">
      <FormLabel>Sets</FormLabel>
      {setFields.map((setField, setIndex) => (
        <div key={setField.id} className="flex items-end space-x-2 p-2 border rounded-md">
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
          <Button type="button" variant="ghost" size="icon" onClick={() => removeSet(setIndex)} className="shrink-0">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => appendSet({ reps: 8, weight: 0 })}
      >
        <Plus className="mr-2 h-3 w-3" /> Add Set
      </Button>
       {control.getFieldState(`exercises.${exerciseIndex}.sets`)?.error?.message && (
         <p className="text-sm font-medium text-destructive">{control.getFieldState(`exercises.${exerciseIndex}.sets`)?.error?.message}</p>
      )}
    </div>
  );
};

export default NewTemplatePage;
