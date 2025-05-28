
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import type { WorkoutTemplate } from '@/types';

// Sample data for now
const sampleTemplates: WorkoutTemplate[] = [
  { id: "t1", name: "Push Day Classic", description: "Chest, Shoulders, Triceps", exercises: [] },
  { id: "t2", name: "Leg Day Annihilator", description: "Quads, Hamstrings, Calves", exercises: [] },
];

const TemplatesPage = () => {
  const [templates, setTemplates] = React.useState<WorkoutTemplate[]>(sampleTemplates);

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
        <p className="text-muted-foreground text-center py-8">No templates created yet. Add your first one!</p>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {/* Placeholder for exercises summary */}
                  {template.exercises.length > 0 ? `${template.exercises.length} exercises` : "No exercises in this template."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
