"use client";

import {
  Exercise,
  PRIMARY_MOVEMENTS,
  RESISTANCE_TYPES,
} from "@/types/exercise";

interface ExerciseListProps {
  exercises: Exercise[];
  onEdit?: (exercise: Exercise) => void;
  onDelete?: (exerciseId: string) => void;
}

export default function ExerciseList({ exercises, onEdit, onDelete }: ExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No exercises created yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Use the form to create your first exercise.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Exercises ({exercises.length})
      </h2>
      <div className="space-y-3">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit?: (exercise: Exercise) => void;
  onDelete?: (exerciseId: string) => void;
}

function ExerciseCard({ exercise, onEdit, onDelete }: ExerciseCardProps) {
  const movementLabel =
    exercise.primaryMovement === "other"
      ? exercise.customMovementName
      : PRIMARY_MOVEMENTS.find((m) => m.value === exercise.primaryMovement)?.label;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{exercise.name}</h3>

          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Movement:</span>
              <span className="font-medium text-gray-700">{movementLabel}</span>
            </div>

            {exercise.resistances.length > 0 && (
              <div className="text-sm">
                <span className="text-gray-500">Resistance:</span>
                <div className="mt-1 space-y-1">
                  {exercise.resistances.map((r) => {
                    const resistanceInfo = RESISTANCE_TYPES.find((rt) => rt.value === r.type);
                    const parts = [resistanceInfo?.label];
                    if (r.weight !== undefined) {
                      parts.push(`${r.weight} lbs`);
                    }
                    if (r.isDual) {
                      parts.push("(Dual)");
                    }
                    return (
                      <div key={r.id} className="font-medium text-gray-700 ml-2">
                        {parts.join(" - ")}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Reps:</span>
              <span className="font-medium text-gray-700">
                <RepDisplay repConfig={exercise.repConfiguration} />
              </span>
            </div>
          </div>

          {exercise.notes && (
            <p className="mt-2 text-sm text-gray-500 italic">{exercise.notes}</p>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          {onEdit && (
            <button
              onClick={() => onEdit(exercise)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(exercise.id)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RepDisplay({ repConfig }: { repConfig: Exercise["repConfiguration"] }) {
  switch (repConfig.type) {
    case "simple":
      return <>{repConfig.count} reps</>;
    case "hold":
      return <>Hold for {repConfig.durationSeconds}s</>;
    case "tempo":
      return (
        <>
          {repConfig.count} reps @ {repConfig.eccentricSeconds}-{repConfig.pauseBottomSeconds}-
          {repConfig.concentricSeconds}-{repConfig.pauseTopSeconds} tempo
        </>
      );
    case "concentric_only":
      return <>{repConfig.count} reps (concentric only)</>;
    case "eccentric_only":
      return <>{repConfig.count} reps (eccentric only)</>;
    case "explosive":
      return <>{repConfig.count} reps (explosive)</>;
  }
}
