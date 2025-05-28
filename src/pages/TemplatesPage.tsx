
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from 'lucide-react'; // Added Edit and Trash2
import type { WorkoutTemplate } from '@/types';

// Sample data for initial state
const sampleTemplates: WorkoutTemplate[] = [
  { id: "t1", name: "Push Day Classic", description: "Chest, Shoulders, Triceps", exercises: [] },
  { id: "t2", name: "Leg Day Annihilator", description: "Quads, Hamstrings, Calves", exercises: [] },
];

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(sampleTemplates);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.newTemplate) {
      const newTemplate = location.state.newTemplate as WorkoutTemplate;
      // Avoid adding duplicates if user navigates back and forth
      if (!templates.find(t => t.id === newTemplate.id)) {
        setTemplates(prevTemplates => [newTemplate, ...prevTemplates]);
      }
      // Clear location state after processing
      window.history.replaceState({}, document.title)
    }
  }, [location.state, templates]);

  const handleDeleteTemplate = (templateId: string) => {
    // Implement delete functionality here
    // For now, let's use a confirm dialog and filter out the template
    if (window.confirm("Are you sure you want to delete this template?")) {
      setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== templateId));
      // Potentially show a toast message here
      console.log(`Template ${templateId} deleted (locally)`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Workout Templates</h2>
        <Button asChild>
          <Link to="/new-template">
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </Link>
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">No templates created yet. Add your first one!</p>
             <Button asChild className="mt-4">
              <Link to="/new-template">
                <Plus className="mr-2 h-4 w-4" /> Create Template
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{template.name}</CardTitle>
                    {template.description && <CardDescription>{template.description}</CardDescription>}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      {/* TODO: Implement edit functionality - navigate to /edit-template/:id or /new-template with state */}
                      <Link to={`/new-template`} state={{ templateToEdit: template }}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="text-sm font-medium mb-1">Exercises:</h4>
                {template.exercises.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {template.exercises.map((ex, index) => (
                      <li key={`${ex.exercise.id}-${index}`}>
                        {ex.exercise.name} ({ex.sets.length} set{ex.sets.length > 1 ? 's' : ''})
                        <ul className="list-['-_'] list-inside ml-4 text-xs">
                            {ex.sets.map((set, setIdx) => (
                                <li key={setIdx}>{set.reps} reps @ {set.weight}kg</li>
                            ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No exercises in this template.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;

