import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Habit, Completions, HabitColor } from '@/types';
import { getTodayDateString } from '@/utils/date';
import { generateId } from '@/utils/generateId';
import AddHabitForm from '../components/AddHabitForm';
import HabitList from '../components/HabitList';
import ProgressCalendar from '../components/ProgressCalendar';
import EditHabitModal from '../components/EditHabitModal';

const HomePage: React.FC = () => {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
    const [completions, setCompletions] = useLocalStorage<Completions>('completions', {});
    const [selectedHabitId, setSelectedHabitId] = useState<string | 'all'>('all');
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const today = useMemo(() => getTodayDateString(), []);

    const addHabit = (name: string, color: HabitColor) => {
        if (name.trim() === '') return;
        const newHabit: Habit = {
            id: generateId(),
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
        <View style={styles.container}>
            <View style={styles.column}>
                <View style={styles.formContainer}>
                    <AddHabitForm onAddHabit={addHabit} />
                </View>
                <View style={styles.listContainer}>
                    <HabitList
                        habits={habits}
                        completions={completions[today] || []}
                        onToggle={id => toggleHabit(id, today)}
                        onDelete={deleteHabit}
                        onEdit={setEditingHabit}
                    />
                </View>
            </View>
            <View style={styles.calendarContainer}>
                <ProgressCalendar
                    habits={habits}
                    completions={filteredCompletions}
                    selectedHabitId={selectedHabitId}
                    onSelectHabit={setSelectedHabitId}
                />
            </View>
            {editingHabit && (
                <EditHabitModal
                    habit={editingHabit}
                    onUpdate={updateHabit}
                    onClose={() => setEditingHabit(null)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    column: {
        marginBottom: 24,
    },
    formContainer: {
        marginBottom: 24,
    },
    listContainer: {
        marginBottom: 24,
    },
    calendarContainer: {},
});

export default HomePage;