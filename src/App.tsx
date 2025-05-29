
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import WorkoutsPage from "./pages/WorkoutsPage";
import TemplatesPage from "./pages/TemplatesPage";
import NewWorkoutPage from "./pages/NewWorkoutPage";
import WorkoutSessionPage from "./pages/WorkoutSessionPage";
import NewTemplatePage from "./pages/NewTemplatePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/workouts" replace />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/new-workout" element={<NewWorkoutPage />} />
            <Route path="/new-template" element={<NewTemplatePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
