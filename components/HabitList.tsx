import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
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
    const isDarkMode = useColorScheme() === 'dark';
    const styles = getStyles(isDarkMode);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today's Habits</Text>
            {habits.length === 0 ? (
                <Text style={styles.emptyText}>No habits yet. Add one to get started!</Text>
            ) : (
                <View style={styles.list}>
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
                </View>
            )}
        </View>
    );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        backgroundColor: isDarkMode ? '#1e293b' : '#fff', // dark:bg-slate-800
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: isDarkMode ? '#e2e8f0' : '#1e293b', // dark:text-slate-200
    },
    emptyText: {
        color: isDarkMode ? '#94a3b8' : '#64748b', // dark:text-slate-400
        textAlign: 'center',
        paddingVertical: 16,
    },
    list: {
        gap: 8,
    }
});

export default HabitList;