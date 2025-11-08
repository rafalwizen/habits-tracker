import React from 'react';
import { Habit } from '../types';
import HabitItem from './HabitItem';

interface HabitListProps {
    habits: Habit[];
    completions: string[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, completions, onToggle, onDelete, onEdit }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Today's Habits</h2>
            {habits.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">No habits yet. Add one to get started!</p>
            ) : (
                <div className="space-y-2">
                    {habits.map(habit => (
                        <HabitItem
                            key={habit.id}
                            habit={habit}
                            isCompleted={completions.includes(habit.id)}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HabitList;
