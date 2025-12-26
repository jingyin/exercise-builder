// Primary movements - the main exercise movement pattern
export type PrimaryMovement =
  | "squat"
  | "deadlift"
  | "bench_press"
  | "overhead_press"
  | "row"
  | "pull_up"
  | "lunge"
  | "hip_thrust"
  | "curl"
  | "tricep_extension"
  | "lateral_raise"
  | "fly"
  | "leg_press"
  | "leg_curl"
  | "leg_extension"
  | "calf_raise"
  | "nordic_curl"
  | "plank"
  | "crunch"
  | "russian_twist"
  | "other";

export const PRIMARY_MOVEMENTS: { value: PrimaryMovement; label: string }[] = [
  { value: "squat", label: "Squat" },
  { value: "deadlift", label: "Deadlift" },
  { value: "bench_press", label: "Bench Press" },
  { value: "overhead_press", label: "Overhead Press" },
  { value: "row", label: "Row" },
  { value: "pull_up", label: "Pull Up" },
  { value: "lunge", label: "Lunge" },
  { value: "hip_thrust", label: "Hip Thrust" },
  { value: "curl", label: "Curl" },
  { value: "tricep_extension", label: "Tricep Extension" },
  { value: "lateral_raise", label: "Lateral Raise" },
  { value: "fly", label: "Fly" },
  { value: "leg_press", label: "Leg Press" },
  { value: "leg_curl", label: "Leg Curl" },
  { value: "leg_extension", label: "Leg Extension" },
  { value: "calf_raise", label: "Calf Raise" },
  { value: "nordic_curl", label: "Nordic Curl" },
  { value: "plank", label: "Plank" },
  { value: "crunch", label: "Crunch" },
  { value: "russian_twist", label: "Russian Twist" },
  { value: "other", label: "Other" },
];

// Resistance types - all possible resistance sources
export type ResistanceType =
  | "barbell"
  | "dumbbell"
  | "kettlebell"
  | "cable_machine"
  | "smith_machine"
  | "resistance_machine"
  | "bodyweight"
  | "ez_bar"
  | "trap_bar"
  | "landmine"
  | "medicine_ball"
  | "weight_plate"
  | "resistance_band_add"
  | "resistance_band_reduce"
  | "chains"
  | "weight_vest"
  | "ankle_weights"
  | "assisted_machine";

export const RESISTANCE_TYPES: { value: ResistanceType; label: string; description?: string }[] = [
  { value: "barbell", label: "Barbell" },
  { value: "dumbbell", label: "Dumbbell" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "cable_machine", label: "Cable Machine" },
  { value: "smith_machine", label: "Smith Machine" },
  { value: "resistance_machine", label: "Resistance Machine" },
  { value: "bodyweight", label: "Bodyweight" },
  { value: "ez_bar", label: "EZ Bar" },
  { value: "trap_bar", label: "Trap Bar" },
  { value: "landmine", label: "Landmine" },
  { value: "medicine_ball", label: "Medicine Ball" },
  { value: "weight_plate", label: "Weight Plate" },
  { value: "resistance_band_add", label: "Resistance Band (Add)", description: "Adds resistance at end of movement" },
  { value: "resistance_band_reduce", label: "Resistance Band (Reduce)", description: "Assists/reduces resistance" },
  { value: "chains", label: "Chains", description: "Progressive resistance increase" },
  { value: "weight_vest", label: "Weight Vest", description: "Additional body weight" },
  { value: "ankle_weights", label: "Ankle Weights", description: "Leg-focused resistance" },
  { value: "assisted_machine", label: "Assisted Machine", description: "Machine-assisted reduction" },
];

// A resistance entry with its specific weight and dual flag
export interface ResistanceEntry {
  id: string; // Unique ID to allow multiple of same type
  type: ResistanceType;
  weight?: number; // Weight in lbs (optional)
  isDual: boolean; // Whether using dual resistance (e.g., two bands per side)
}

// Rep types - how the exercise is performed
export type RepType = "simple" | "hold" | "tempo" | "concentric_only" | "eccentric_only" | "explosive";

// Simple reps - standard repetitions
export interface SimpleReps {
  type: "simple";
  count: number;
}

// Hold - isometric holds for a duration
export interface HoldReps {
  type: "hold";
  durationSeconds: number;
}

// Tempo reps - reps with specific timing for each phase
export interface TempoReps {
  type: "tempo";
  count: number;
  eccentricSeconds: number; // Lowering/lengthening phase
  pauseBottomSeconds: number; // Pause at stretched position
  concentricSeconds: number; // Lifting/shortening phase
  pauseTopSeconds: number; // Pause at contracted position
}

// Concentric-only reps - only the lifting/shortening phase
export interface ConcentricOnlyReps {
  type: "concentric_only";
  count: number;
}

// Eccentric-only reps - only the lowering/lengthening phase
export interface EccentricOnlyReps {
  type: "eccentric_only";
  count: number;
}

// Explosive reps - performed with maximum speed/power
export interface ExplosiveReps {
  type: "explosive";
  count: number;
}

export type RepConfiguration = SimpleReps | HoldReps | TempoReps | ConcentricOnlyReps | EccentricOnlyReps | ExplosiveReps;

export const REP_TYPES: { value: RepType; label: string; description: string }[] = [
  { value: "simple", label: "Simple Reps", description: "Standard repetitions" },
  { value: "hold", label: "Hold", description: "Isometric hold for duration" },
  { value: "tempo", label: "Tempo Reps", description: "Reps with specific timing" },
  { value: "concentric_only", label: "Concentric Only", description: "Lifting phase only" },
  { value: "eccentric_only", label: "Eccentric Only", description: "Lowering phase only" },
  { value: "explosive", label: "Explosive", description: "Maximum speed/power" },
];

// Complete exercise definition
export interface Exercise {
  id: string;
  name: string;
  primaryMovement: PrimaryMovement;
  customMovementName?: string; // Used when primaryMovement is "other"
  resistances: ResistanceEntry[]; // List of resistances with their weights and dual flags
  repConfiguration: RepConfiguration;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form state for a single resistance entry
export interface ResistanceFormEntry {
  id: string; // Unique ID to allow multiple of same type
  type: ResistanceType;
  weight: string; // String for form input
  isDual: boolean;
}

// Form state for creating/editing exercises
export interface ExerciseFormState {
  name: string;
  primaryMovement: PrimaryMovement;
  customMovementName: string;
  resistances: ResistanceFormEntry[];
  repType: RepType;
  simpleRepCount: number;
  holdDuration: number;
  tempoRepCount: number;
  tempoEccentric: number;
  tempoPauseBottom: number;
  tempoConcentric: number;
  tempoPauseTop: number;
  notes: string;
}

export const DEFAULT_FORM_STATE: ExerciseFormState = {
  name: "",
  primaryMovement: "squat",
  customMovementName: "",
  resistances: [],
  repType: "simple",
  simpleRepCount: 10,
  holdDuration: 30,
  tempoRepCount: 8,
  tempoEccentric: 3,
  tempoPauseBottom: 1,
  tempoConcentric: 1,
  tempoPauseTop: 1,
  notes: "",
};
