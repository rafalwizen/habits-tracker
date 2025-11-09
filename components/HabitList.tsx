import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Habit } from '@/types';
import HabitItem from './HabitItem';
import { Colors } from '@/constants/Colors';

interface HabitListProps {
    habits: Habit[];
    completions: string[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, completions, onToggle, onDelete, onEdit }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const isDarkMode = colorScheme === 'dark';

    const dynamicStyles = {
        container: {
            backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card,
        },
        title: {
            color: isDarkMode ? Colors.dark.text : Colors.light.text,
        },
        emptyText: {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
        },
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Text style={[styles.title, dynamicStyles.title]}>Today's Habits</Text>
            {habits.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, dynamicStyles.emptyText]}>No habits yet. Add one to get started!</Text>
                </View>
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

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    emptyText: {
        textAlign: 'center',
    },
    list: {
        gap: 8,
    },
});


export default HabitList;
