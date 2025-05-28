
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NewWorkoutPage = () => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Start New Workout</h2>
      <p className="text-muted-foreground">
        This is where you'll select exercises and track your sets, reps, and weight.
      </p>
      <p className="text-sm">(Feature coming soon!)</p>
      <Button asChild variant="outline">
        <Link to="/">Back to Workouts</Link>
      </Button>
    </div>
  );
};

export default NewWorkoutPage;
