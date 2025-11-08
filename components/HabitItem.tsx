import React from 'react';
import { Habit, HabitColor } from '../types';
import { CheckIcon, TrashIcon, PencilIcon } from './Icons';

interface HabitItemProps {
    habit: Habit;
    isCompleted: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, isCompleted, onToggle, onDelete, onEdit }) => {
    // Manually specify classes for Tailwind CDN
    const colorClasses: Record<HabitColor, { dot: string }> = {
        emerald: { dot: 'bg-emerald-500' },
        sky: { dot: 'bg-sky-500' },
        indigo: { dot: 'bg-indigo-500' },
        rose: { dot: 'bg-rose-500' },
        amber: { dot: 'bg-amber-500' },
        violet: { dot: 'bg-violet-500' },
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-900/50' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
            <button
                onClick={() => onToggle(habit.id)}
                className="flex items-center gap-3 flex-grow text-left"
                aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
            >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-500'}`}>
                    {isCompleted && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colorClasses[habit.color]?.dot || 'bg-slate-500'}`}></div>
                    <span className={`text-slate-700 dark:text-slate-200 ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                {habit.name}
            </span>
                </div>
            </button>
            <div className="flex items-center flex-shrink-0">
                <button
                    onClick={() => onEdit(habit)}
                    aria-label={`Edit habit: ${habit.name}`}
                    className="text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 p-1 rounded-full transition"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(habit.id)}
                    aria-label={`Delete habit: ${habit.name}`}
                    className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full transition"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default HabitItem;
