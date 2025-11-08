import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Habit, Completions, HabitColor } from './types';
import { getTodayDateString } from './utils/date';
import Header from './components/Header';
import AddHabitForm from './components/AddHabitForm';
import HabitList from './components/HabitList';
import ProgressCalendar from './components/ProgressCalendar';
import EditHabitModal from './components/EditHabitModal';

const App: React.FC = () => {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
    const [completions, setCompletions] = useLocalStorage<Completions>('completions', {});
    const [selectedHabitId, setSelectedHabitId] = useState<string | 'all'>('all');
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const today = useMemo(() => getTodayDateString(), []);

    const addHabit = (name: string, color: HabitColor) => {
        if (name.trim() === '') return;
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            name: name.trim(),
            createdAt: new Date().toISOString(),
            color: color,
        };
        setHabits([...habits, newHabit]);
    };

    const updateHabit = (id: string, newName: string, newColor: HabitColor) => {
        setHabits(habits.map(h => h.id === id ? { ...h, name: newName.trim(), color: newColor } : h));
        setEditingHabit(null);
    };

    const deleteHabit = (id: string) => {
        setHabits(habits.filter(habit => habit.id !== id));
        // Also remove completions for this habit
        const newCompletions = { ...completions };
        for (const date in newCompletions) {
            newCompletions[date] = newCompletions[date].filter(habitId => habitId !== id);
            if (newCompletions[date].length === 0) {
                delete newCompletions[date];
            }
        }
        setCompletions(newCompletions);
        if (selectedHabitId === id) {
            setSelectedHabitId('all');
        }
    };

    const toggleHabit = (id: string, date: string) => {
        const dayCompletions = completions[date] || [];
        const isCompleted = dayCompletions.includes(id);

        let newDayCompletions;
        if (isCompleted) {
            newDayCompletions = dayCompletions.filter(habitId => habitId !== id);
        } else {
            newDayCompletions = [...dayCompletions, id];
        }

        const newCompletions = { ...completions };
        if (newDayCompletions.length > 0) {
            newCompletions[date] = newDayCompletions;
        } else {
            delete newCompletions[date];
        }
        setCompletions(newCompletions);
    };

    const filteredCompletions = useMemo(() => {
        if (selectedHabitId === 'all') return completions;
        const filtered: Completions = {};
        for (const date in completions) {
            if (completions[date].includes(selectedHabitId)) {
                filtered[date] = [selectedHabitId];
            }
        }
        return filtered;
    }, [completions, selectedHabitId]);

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <Header />
            <main className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <AddHabitForm onAddHabit={addHabit} />
                        <HabitList
                            habits={habits}
                            completions={completions[today] || []}
                            onToggle={id => toggleHabit(id, today)}
                            onDelete={deleteHabit}
                            onEdit={setEditingHabit}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <ProgressCalendar
                            habits={habits}
                            completions={filteredCompletions}
                            selectedHabitId={selectedHabitId}
                            onSelectHabit={setSelectedHabitId}
                        />
                    </div>
                </div>
            </main>
            {editingHabit && (
                <EditHabitModal
                    habit={editingHabit}
                    onUpdate={updateHabit}
                    onClose={() => setEditingHabit(null)}
                />
            )}
            <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
                <p>Built with ❤️ by a world-class React engineer.</p>
            </footer>
        </div>
    );
};

export default App;
