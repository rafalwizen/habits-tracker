import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Habit, HabitColor } from '../types';
import { CheckIcon, TrashIcon, PencilIcon } from './Icons';

interface HabitItemProps {
    habit: Habit;
    isCompleted: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
}

const colorValues: Record<HabitColor, { dot: string }> = {
    emerald: { dot: '#10b981' }, sky: { dot: '#0ea5e9' }, indigo: { dot: '#6366f1' },
    rose: { dot: '#f43f5e' }, amber: { dot: '#f59e0b' }, violet: { dot: '#8b5cf6' },
};

const HabitItem: React.FC<HabitItemProps> = ({ habit, isCompleted, onToggle, onDelete, onEdit }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = getStyles(isDarkMode, isCompleted);
    const dotColor = colorValues[habit.color]?.dot || '#64748b'; // slate-500 fallback

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => onToggle(habit.id)}
                style={styles.mainButton}
                aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
            >
                <View style={styles.checkBox}>
                    {isCompleted && <CheckIcon size={16} color="white" />}
                </View>
                <View style={styles.nameContainer}>
                    <View style={[styles.colorDot, { backgroundColor: dotColor }]}></View>
                    <Text style={styles.nameText}>
                        {habit.name}
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    onPress={() => onEdit(habit)}
                    aria-label={`Edit habit: ${habit.name}`}
                    style={styles.iconButton}
                >
                    <PencilIcon size={20} color="#94a3b8" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onDelete(habit.id)}
                    aria-label={`Delete habit: ${habit.name}`}
                    style={styles.iconButton}
                >
                    <TrashIcon size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getStyles = (isDarkMode: boolean, isCompleted: boolean) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 6,
        backgroundColor: isCompleted
            ? (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5') // emerald-900/50 or emerald-50
            : (isDarkMode ? 'rgba(51, 65, 85, 0.5)' : '#f8fafc'), // slate-700/50 or slate-50
    },
    mainButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    checkBox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: isCompleted ? '#10b981' : (isDarkMode ? '#64748b' : '#cbd5e1'),
        backgroundColor: isCompleted ? '#10b981' : 'transparent',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    nameText: {
        color: isCompleted
            ? (isDarkMode ? '#64748b' : '#94a3b8') // dark:text-slate-500 or text-slate-400
            : (isDarkMode ? '#e2e8f0' : '#334155'), // dark:text-slate-200 or text-slate-700
        textDecorationLine: isCompleted ? 'line-through' : 'none',
        fontSize: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 4,
    }
});

export default HabitItem;