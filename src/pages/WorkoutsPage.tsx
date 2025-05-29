
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Calendar, Clock } from 'lucide-react';
import type { Workout } from '@/types';

// Sample data for now
const sampleWorkouts: Workout[] = [
  { id: "w1", name: "Full Body Blast", date: new Date().toISOString(), exercises: [], duration: 60 },
  { id: "w2", name: "Upper Body Focus", date: new Date(Date.now() - 86400000).toISOString(), exercises: [], duration: 45 },
];

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = React.useState<Workout[]>(sampleWorkouts);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.completedWorkout) {
      const completedWorkout = location.state.completedWorkout as Workout;
      if (!workouts.find(w => w.id === completedWorkout.id)) {
        setWorkouts(prevWorkouts => [completedWorkout, ...prevWorkouts]);
      }
      // Clear location state after processing
      window.history.replaceState({}, document.title);
    }
  }, [location.state, workouts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">No workouts logged yet. Start your first one!</p>
            <Button asChild className="mt-4">
              <Link to="/new-workout">
                <Plus className="mr-2 h-4 w-4" /> Start New Workout
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{workout.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(workout.date)}
                      </span>
                      {workout.duration && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {workout.duration} mins
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {workout.exercises.length > 0 
                      ? `${workout.exercises.length} exercise${workout.exercises.length !== 1 ? 's' : ''}` 
                      : "No exercises recorded."}
                  </p>
                  {workout.exercises.length > 0 && (
                    <div className="space-y-1">
                      {workout.exercises.slice(0, 3).map((ex, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {ex.exercise.name} ({ex.sets.length} set{ex.sets.length !== 1 ? 's' : ''})
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          + {workout.exercises.length - 3} more exercise{workout.exercises.length - 3 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                  {workout.notes && (
                    <p className="text-xs text-muted-foreground italic border-l-2 border-muted pl-2 mt-2">
                      "{workout.notes}"
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutsPage;
