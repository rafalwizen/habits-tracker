import React, { useState } from 'react';
import { PlusIcon } from './Icons';
import { HABIT_COLORS, HabitColor, DEFAULT_HABIT_COLOR } from '../types';

// A simple reusable color picker component
const ColorPicker: React.FC<{ selectedColor: HabitColor; onSelectColor: (color: HabitColor) => void; }> = ({ selectedColor, onSelectColor }) => {
    // Need to define color styles manually as Tailwind CDN can't handle dynamic classes
    const colorClasses: Record<HabitColor, string> = {
        emerald: 'bg-emerald-500',
        sky: 'bg-sky-500',
        indigo: 'bg-indigo-500',
        rose: 'bg-rose-500',
        amber: 'bg-amber-500',
        violet: 'bg-violet-500',
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {HABIT_COLORS.map(color => (
                <button
                    type="button"
                    key={color}
                    onClick={() => onSelectColor(color)}
                    className={`w-7 h-7 rounded-full transition ${colorClasses[color]} ${selectedColor === color ? 'ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-slate-900 dark:ring-white' : ''}`}
                    aria-label={`Select color ${color}`}
                />
            ))}
        </div>
    );
};


interface AddHabitFormProps {
    onAddHabit: (name: string, color: HabitColor) => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAddHabit }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState<HabitColor>(DEFAULT_HABIT_COLOR);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddHabit(name, color);
        setName('');
        setColor(DEFAULT_HABIT_COLOR);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Add New Habit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Meditate for 10 minutes"
                    className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
                <ColorPicker selectedColor={color} onSelectColor={setColor} />
                <button
                    type="submit"
                    className="w-full bg-emerald-500 text-white rounded-md px-4 py-2 font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={!name.trim()}
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Habit</span>
                </button>
            </form>
        </div>
    );
};

export default AddHabitForm;
