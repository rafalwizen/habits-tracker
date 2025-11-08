import React, { useState, useMemo } from 'react';
import { ScrollView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Habit, Completions, HabitColor } from '../types';
import { getTodayDateString } from '../utils/date';
import AddHabitForm from '../components/AddHabitForm';
import HabitList from '../components/HabitList';
import ProgressCalendar from '../components/ProgressCalendar';
import EditHabitModal from '../components/EditHabitModal';

const HomePage: React.FC = () => {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
    const [completions, setCompletions] = useLocalStorage<Completions>('completions', {});
    const [selectedHabitId, setSelectedHabitId] = useState<string | 'all'>('all');
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1024; // Tailwind 'lg' breakpoint

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

    const mainContent = (
        <View style={[styles.mainGrid, isLargeScreen && styles.mainGridLarge]}>
            <View style={[styles.leftColumn, isLargeScreen && styles.leftColumnLarge]}>
                <AddHabitForm onAddHabit={addHabit} />
                <HabitList
                    habits={habits}
                    completions={completions[today] || []}
                    onToggle={id => toggleHabit(id, today)}
                    onDelete={deleteHabit}
                    onEdit={setEditingHabit}
                />
            </View>
            <View style={[styles.rightColumn, isLargeScreen && styles.rightColumnLarge]}>
                <ProgressCalendar
                    habits={habits}
                    completions={filteredCompletions}
                    selectedHabitId={selectedHabitId}
                    onSelectHabit={setSelectedHabitId}
                />
            </View>
        </View>
    );

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                {mainContent}
            </ScrollView>
            {editingHabit && (
                <EditHabitModal
                    habit={editingHabit}
                    onUpdate={updateHabit}
                    onClose={() => setEditingHabit(null)}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        maxWidth: 1024,
        width: '100%',
        alignSelf: 'center',
    },
    mainGrid: {
        gap: 32,
    },
    mainGridLarge: {
        flexDirection: 'row',
    },
    leftColumn: {
        gap: 24,
    },
    leftColumnLarge: {
        flex: 1,
    },
    rightColumn: {},
    rightColumnLarge: {
        flex: 2,
    }
});


export default HomePage;