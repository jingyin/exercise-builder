# Exercise Logger

A Next.js application for logging exercises with detailed tracking of movements, resistances, and rep configurations.

## Key Features

### Multi-Resistance Support

Unlike typical exercise trackers, this app supports multiple resistances per exercise - useful for niche training scenarios like using two resistance bands per side. Each resistance entry includes:

- **Type** - Barbell, dumbbell, kettlebell, resistance bands, cables, machines, etc.
- **Weight** - Optional weight in lbs
- **Dual** - Whether the resistance is bilateral (e.g., two bands per side)

### Extended Rep Type Support

Beyond simple rep counting, the app supports various rep configurations:

- **Simple Reps** - Standard repetitions
- **Hold** - Isometric holds with duration tracking
- **Tempo** - Reps with specific timing for each phase (eccentric, pause bottom, concentric, pause top)
- **Concentric Only** - Lifting phase only
- **Eccentric Only** - Lowering phase only (negatives)
- **Explosive** - Maximum speed/power reps

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
