"use client";

import { useState } from "react";
import ExerciseForm from "@/components/ExerciseForm";
import ExerciseList from "@/components/ExerciseList";
import { Exercise } from "@/types/exercise";

export default function Home() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const handleSubmit = (exercise: Exercise) => {
    if (editingExercise) {
      // Update existing exercise
      setExercises((prev) =>
        prev.map((e) => (e.id === exercise.id ? exercise : e))
      );
      setEditingExercise(null);
    } else {
      // Add new exercise
      setExercises((prev) => [...prev, exercise]);
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
    // Clear editing if we're deleting the exercise being edited
    if (editingExercise?.id === exerciseId) {
      setEditingExercise(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingExercise(null);
  };

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exercise Logger</h1>
          <p className="text-gray-600 mt-1">
            Log and manage your workout exercises
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            {editingExercise && (
              <div className="mb-4">
                <button
                  onClick={handleCancelEdit}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel editing
                </button>
              </div>
            )}
            <ExerciseForm
              key={editingExercise?.id || "new"}
              onSubmit={handleSubmit}
              initialExercise={editingExercise || undefined}
            />
          </div>

          <div>
            <ExerciseList
              exercises={exercises}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
