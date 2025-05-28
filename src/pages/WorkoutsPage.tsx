
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import type { Workout } from '@/types';

// Sample data for now
const sampleWorkouts: Workout[] = [
  { id: "w1", name: "Full Body Blast", date: new Date().toISOString(), exercises: [], duration: 60 },
  { id: "w2", name: "Upper Body Focus", date: new Date(Date.now() - 86400000).toISOString(), exercises: [], duration: 45 },
];

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = React.useState<Workout[]>(sampleWorkouts);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Workouts</h2>
        <Button asChild>
          <Link to="/new-workout">
            <Plus className="mr-2 h-4 w-4" /> Start New
          </Link>
        </Button>
      </div>
      
      {workouts.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No workouts logged yet. Start your first one!</p>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                <CardDescription>
                  {new Date(workout.date).toLocaleDateString()} - {workout.duration} mins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {/* Placeholder for exercises summary */}
                  {workout.exercises.length > 0 ? `${workout.exercises.length} exercises` : "No exercises recorded."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutsPage;
