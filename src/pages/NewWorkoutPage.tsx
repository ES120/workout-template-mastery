
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Dumbbell } from 'lucide-react';
import type { WorkoutTemplate } from '@/types';

// Sample templates - in real app this would come from state/database
const sampleTemplates: WorkoutTemplate[] = [
  {
    id: "t1",
    name: "Push Day Classic",
    description: "Chest, Shoulders, Triceps",
    exercises: []
  },
  {
    id: "t2", 
    name: "Leg Day Annihilator",
    description: "Quads, Hamstrings, Calves",
    exercises: []
  }
];

const NewWorkoutPage = () => {
  const navigate = useNavigate();

  const handleStartFromScratch = () => {
    navigate('/workout-session', { 
      state: { 
        workoutType: 'scratch',
        workoutName: 'New Workout'
      } 
    });
  };

  const handleStartFromTemplate = (template: WorkoutTemplate) => {
    navigate('/workout-session', { 
      state: { 
        workoutType: 'template',
        template: template,
        workoutName: template.name
      } 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Start New Workout</h2>
        <Button asChild variant="outline">
          <Link to="/workouts">Back to Workouts</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={handleStartFromScratch}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Plus className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Start from Scratch</CardTitle>
                <CardDescription>Create a completely new workout</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div>
          <h3 className="text-lg font-medium mb-3">Start from Template</h3>
          <div className="space-y-3">
            {sampleTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleStartFromTemplate(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Dumbbell className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      {template.description && (
                        <CardDescription className="text-sm">{template.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewWorkoutPage;
