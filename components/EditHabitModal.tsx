import React, { useState, useEffect } from 'react';
import { Habit, HABIT_COLORS, HabitColor } from '../types';

// A simple reusable color picker component
const ColorPicker: React.FC<{ selectedColor: HabitColor; onSelectColor: (color: HabitColor) => void; }> = ({ selectedColor, onSelectColor }) => {
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


interface EditHabitModalProps {
    habit: Habit;
    onUpdate: (id: string, newName: string, newColor: HabitColor) => void;
    onClose: () => void;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, onUpdate, onClose }) => {
    const [name, setName] = useState(habit.name);
    const [color, setColor] = useState<HabitColor>(habit.color);

    useEffect(() => {
        setName(habit.name);
        setColor(habit.color);
    }, [habit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onUpdate(habit.id, name, color);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-habit-title"
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="edit-habit-title" className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Edit Habit</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="habit-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Habit Name
                        </label>
                        <input
                            id="habit-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Color
                        </label>
                        <ColorPicker selectedColor={color} onSelectColor={setColor} />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md px-4 py-2 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-emerald-500 text-white rounded-md px-4 py-2 font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition disabled:opacity-50"
                            disabled={!name.trim()}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditHabitModal;
