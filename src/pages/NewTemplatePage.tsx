
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const NewTemplatePage = () => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Create New Template</h2>
      <p className="text-muted-foreground">
        Build your reusable workout plans here by adding exercises and target sets/reps.
      </p>
      <p className="text-sm">(Feature coming soon!)</p>
      <Button asChild variant="outline">
        <Link to="/templates">Back to Templates</Link>
      </Button>
    </div>
  );
};

export default NewTemplatePage;
