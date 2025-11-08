export const HABIT_COLORS = [
    'emerald',
    'sky',
    'indigo',
    'rose',
    'amber',
    'violet',
] as const;

export type HabitColor = typeof HABIT_COLORS[number];

export const DEFAULT_HABIT_COLOR: HabitColor = 'emerald';


export interface Habit {
    id: string;
    name: string;
    createdAt: string;
    color: HabitColor;
}

// Key is date string 'YYYY-MM-DD', value is array of completed habit IDs
export type Completions = Record<string, string[]>;
