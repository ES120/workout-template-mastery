
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Dumbbell, Book, Timer, Plus } from "lucide-react"; // Using some available icons
import { Button } from "@/components/ui/button"; // Assuming Button component is available

const navItems = [
  { path: "/", label: "Workouts", icon: Dumbbell },
  { path: "/templates", label: "Templates", icon: Book },
  // { path: "/history", label: "History", icon: Timer }, // For future
];

const Layout = () => {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-card p-4 shadow-md">
        <h1 className="text-xl font-bold text-primary text-center">Gym Tracker</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Outlet /> {/* This is where the page content will be rendered */}
      </main>

      <nav className="bg-card border-t border-border shadow-md">
        <div className="container mx-auto flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 rounded-md transition-colors 
                 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
