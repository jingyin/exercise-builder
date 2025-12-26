"use client";

import { useState } from "react";
import {
  Exercise,
  ExerciseFormState,
  DEFAULT_FORM_STATE,
  PRIMARY_MOVEMENTS,
  RESISTANCE_TYPES,
  ResistanceType,
  ResistanceFormEntry,
  REP_TYPES,
  RepConfiguration,
} from "@/types/exercise";

interface ExerciseFormProps {
  onSubmit: (exercise: Exercise) => void;
  initialExercise?: Exercise;
}

export default function ExerciseForm({ onSubmit, initialExercise }: ExerciseFormProps) {
  const [formState, setFormState] = useState<ExerciseFormState>(() => {
    if (initialExercise) {
      return exerciseToFormState(initialExercise);
    }
    return DEFAULT_FORM_STATE;
  });

  const updateField = <K extends keyof ExerciseFormState>(
    field: K,
    value: ExerciseFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const repConfiguration = buildRepConfiguration(formState);
    const exercise: Exercise = {
      id: initialExercise?.id || crypto.randomUUID(),
      name: formState.name || generateExerciseName(formState),
      primaryMovement: formState.primaryMovement,
      customMovementName:
        formState.primaryMovement === "other" ? formState.customMovementName : undefined,
      resistances: formState.resistances.map((r) => ({
        id: r.id,
        type: r.type,
        weight: r.weight ? parseFloat(r.weight) : undefined,
        isDual: r.isDual,
      })),
      repConfiguration,
      notes: formState.notes || undefined,
      createdAt: initialExercise?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSubmit(exercise);
    setFormState(DEFAULT_FORM_STATE);
  };

  const addResistance = (resistanceType: ResistanceType) => {
    const newEntry: ResistanceFormEntry = {
      id: crypto.randomUUID(),
      type: resistanceType,
      weight: "",
      isDual: false,
    };
    setFormState((prev) => ({
      ...prev,
      resistances: [...prev.resistances, newEntry],
    }));
  };

  const removeResistance = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      resistances: prev.resistances.filter((r) => r.id !== id),
    }));
  };

  const updateResistanceEntry = (
    id: string,
    field: "type" | "weight" | "isDual",
    value: string | boolean
  ) => {
    setFormState((prev) => ({
      ...prev,
      resistances: prev.resistances.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900">
        {initialExercise ? "Edit Exercise" : "Create Exercise"}
      </h2>

      {/* Exercise Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Exercise Name (optional)
        </label>
        <input
          type="text"
          id="name"
          value={formState.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder={generateExerciseName(formState)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Leave blank to auto-generate from selections
        </p>
      </div>

      {/* Primary Movement */}
      <div>
        <label htmlFor="primaryMovement" className="block text-sm font-medium text-gray-700 mb-1">
          Primary Movement
        </label>
        <select
          id="primaryMovement"
          value={formState.primaryMovement}
          onChange={(e) => updateField("primaryMovement", e.target.value as typeof formState.primaryMovement)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {PRIMARY_MOVEMENTS.map((movement) => (
            <option key={movement.value} value={movement.value}>
              {movement.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Movement Name (shown when "other" is selected) */}
      {formState.primaryMovement === "other" && (
        <div>
          <label htmlFor="customMovementName" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Movement Name
          </label>
          <input
            type="text"
            id="customMovementName"
            value={formState.customMovementName}
            onChange={(e) => updateField("customMovementName", e.target.value)}
            placeholder="Enter movement name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      )}

      {/* Resistances */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resistances
        </label>

        {/* List of added resistances */}
        {formState.resistances.length > 0 && (
          <div className="space-y-2 mb-3">
            {formState.resistances.map((entry) => (
              <div
                key={entry.id}
                className="p-3 border border-gray-200 rounded-md bg-gray-50 space-y-3"
              >
                {/* Row 1: Type and Remove */}
                <div className="flex items-center justify-between gap-3">
                  <select
                    value={entry.type}
                    onChange={(e) =>
                      updateResistanceEntry(entry.id, "type", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {RESISTANCE_TYPES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeResistance(entry.id)}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>

                {/* Row 2: Weight and Dual */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Weight:</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={entry.weight}
                      onChange={(e) =>
                        updateResistanceEntry(entry.id, "weight", e.target.value)
                      }
                      placeholder="lbs"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <label
                    className={`flex items-center px-3 py-2 border rounded-md cursor-pointer transition-colors ${
                      entry.isDual
                        ? "border-blue-500 bg-blue-100"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={entry.isDual}
                      onChange={(e) =>
                        updateResistanceEntry(entry.id, "isDual", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <span className="text-gray-700">Dual</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Resistance Dropdown */}
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              addResistance(e.target.value as ResistanceType);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-500"
        >
          <option value="">+ Add resistance...</option>
          {RESISTANCE_TYPES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Rep Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rep Type
        </label>
        <div className="space-y-2">
          {REP_TYPES.map((repType) => (
            <label
              key={repType.value}
              className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                formState.repType === repType.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="repType"
                value={repType.value}
                checked={formState.repType === repType.value}
                onChange={(e) => updateField("repType", e.target.value as typeof formState.repType)}
                className="mr-3"
              />
              <div>
                <div className="font-medium text-gray-900">{repType.label}</div>
                <div className="text-sm text-gray-500">{repType.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Rep Configuration based on type */}
      {formState.repType === "simple" && (
        <div>
          <label htmlFor="simpleRepCount" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Reps
          </label>
          <input
            type="number"
            id="simpleRepCount"
            min="1"
            value={formState.simpleRepCount}
            onChange={(e) => updateField("simpleRepCount", parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {formState.repType === "hold" && (
        <div>
          <label htmlFor="holdDuration" className="block text-sm font-medium text-gray-700 mb-1">
            Hold Duration (seconds)
          </label>
          <input
            type="number"
            id="holdDuration"
            min="1"
            value={formState.holdDuration}
            onChange={(e) => updateField("holdDuration", parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {formState.repType === "tempo" && (
        <div className="space-y-4">
          <div>
            <label htmlFor="tempoRepCount" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Reps
            </label>
            <input
              type="number"
              id="tempoRepCount"
              min="1"
              value={formState.tempoRepCount}
              onChange={(e) => updateField("tempoRepCount", parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Tempo (seconds per phase)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="tempoEccentric" className="block text-xs text-gray-600 mb-1">
                  Eccentric (lowering)
                </label>
                <input
                  type="number"
                  id="tempoEccentric"
                  min="0"
                  value={formState.tempoEccentric}
                  onChange={(e) => updateField("tempoEccentric", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tempoPauseBottom" className="block text-xs text-gray-600 mb-1">
                  Pause (bottom)
                </label>
                <input
                  type="number"
                  id="tempoPauseBottom"
                  min="0"
                  value={formState.tempoPauseBottom}
                  onChange={(e) => updateField("tempoPauseBottom", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tempoConcentric" className="block text-xs text-gray-600 mb-1">
                  Concentric (lifting)
                </label>
                <input
                  type="number"
                  id="tempoConcentric"
                  min="0"
                  value={formState.tempoConcentric}
                  onChange={(e) => updateField("tempoConcentric", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="tempoPauseTop" className="block text-xs text-gray-600 mb-1">
                  Pause (top)
                </label>
                <input
                  type="number"
                  id="tempoPauseTop"
                  min="0"
                  value={formState.tempoPauseTop}
                  onChange={(e) => updateField("tempoPauseTop", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Tempo: {formState.tempoEccentric}-{formState.tempoPauseBottom}-{formState.tempoConcentric}-{formState.tempoPauseTop}
            </p>
          </div>
        </div>
      )}

      {(formState.repType === "concentric_only" || formState.repType === "eccentric_only" || formState.repType === "explosive") && (
        <div>
          <label htmlFor="simpleRepCount" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Reps
          </label>
          <input
            type="number"
            id="simpleRepCount"
            min="1"
            value={formState.simpleRepCount}
            onChange={(e) => updateField("simpleRepCount", parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={formState.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          rows={3}
          placeholder="Any additional notes about this exercise..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        {initialExercise ? "Update Exercise" : "Create Exercise"}
      </button>
    </form>
  );
}

// Helper functions
function generateExerciseName(formState: ExerciseFormState): string {
  const movement =
    formState.primaryMovement === "other"
      ? formState.customMovementName || "Custom Exercise"
      : PRIMARY_MOVEMENTS.find((m) => m.value === formState.primaryMovement)?.label || "";

  const resistance =
    formState.resistances.length > 0
      ? RESISTANCE_TYPES.find((r) => r.value === formState.resistances[0].type)?.label
      : "";

  return [resistance, movement].filter(Boolean).join(" ");
}

function buildRepConfiguration(formState: ExerciseFormState): RepConfiguration {
  switch (formState.repType) {
    case "simple":
      return { type: "simple", count: formState.simpleRepCount };
    case "hold":
      return { type: "hold", durationSeconds: formState.holdDuration };
    case "tempo":
      return {
        type: "tempo",
        count: formState.tempoRepCount,
        eccentricSeconds: formState.tempoEccentric,
        pauseBottomSeconds: formState.tempoPauseBottom,
        concentricSeconds: formState.tempoConcentric,
        pauseTopSeconds: formState.tempoPauseTop,
      };
    case "concentric_only":
      return { type: "concentric_only", count: formState.simpleRepCount };
    case "eccentric_only":
      return { type: "eccentric_only", count: formState.simpleRepCount };
    case "explosive":
      return { type: "explosive", count: formState.simpleRepCount };
  }
}

function exerciseToFormState(exercise: Exercise): ExerciseFormState {
  const base: ExerciseFormState = {
    ...DEFAULT_FORM_STATE,
    name: exercise.name,
    primaryMovement: exercise.primaryMovement,
    customMovementName: exercise.customMovementName || "",
    resistances: exercise.resistances.map((r) => ({
      id: r.id,
      type: r.type,
      weight: r.weight?.toString() || "",
      isDual: r.isDual,
    })),
    notes: exercise.notes || "",
  };

  switch (exercise.repConfiguration.type) {
    case "simple":
      return {
        ...base,
        repType: "simple",
        simpleRepCount: exercise.repConfiguration.count,
      };
    case "hold":
      return {
        ...base,
        repType: "hold",
        holdDuration: exercise.repConfiguration.durationSeconds,
      };
    case "tempo":
      return {
        ...base,
        repType: "tempo",
        tempoRepCount: exercise.repConfiguration.count,
        tempoEccentric: exercise.repConfiguration.eccentricSeconds,
        tempoPauseBottom: exercise.repConfiguration.pauseBottomSeconds,
        tempoConcentric: exercise.repConfiguration.concentricSeconds,
        tempoPauseTop: exercise.repConfiguration.pauseTopSeconds,
      };
    case "concentric_only":
      return {
        ...base,
        repType: "concentric_only",
        simpleRepCount: exercise.repConfiguration.count,
      };
    case "eccentric_only":
      return {
        ...base,
        repType: "eccentric_only",
        simpleRepCount: exercise.repConfiguration.count,
      };
    case "explosive":
      return {
        ...base,
        repType: "explosive",
        simpleRepCount: exercise.repConfiguration.count,
      };
  }
}
