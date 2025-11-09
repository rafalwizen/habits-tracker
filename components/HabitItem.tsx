import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Habit, HabitColor } from '@/types';
import { CheckIcon, TrashIcon, PencilIcon } from './Icons';
import { Colors } from '@/constants/Colors';

interface HabitItemProps {
    habit: Habit;
    isCompleted: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
}

const colorClasses: Record<HabitColor, { bg: string, dot: string }> = {
    emerald: { bg: 'rgba(16, 185, 129, 0.1)', dot: Colors.emerald },
    sky: { bg: 'rgba(14, 165, 233, 0.1)', dot: Colors.sky },
    indigo: { bg: 'rgba(99, 102, 241, 0.1)', dot: Colors.indigo },
    rose: { bg: 'rgba(244, 63, 94, 0.1)', dot: Colors.rose },
    amber: { bg: 'rgba(245, 158, 11, 0.1)', dot: Colors.amber },
    violet: { bg: 'rgba(139, 92, 246, 0.1)', dot: Colors.violet },
};

const HabitItem: React.FC<HabitItemProps> = ({ habit, isCompleted, onToggle, onDelete, onEdit }) => {
    const habitColor = colorClasses[habit.color] || colorClasses.emerald;
    const colorScheme = useColorScheme() ?? 'light';
    const isDarkMode = colorScheme === 'dark';

    // Fix: Explicitly type `textDecorationLine` to prevent TypeScript from inferring it as a generic `string`.
    const textDecorationLineStyle: 'line-through' | 'none' = isCompleted ? 'line-through' : 'none';

    const dynamicStyles = {
        container: {
            backgroundColor: isCompleted ? habitColor.bg : (isDarkMode ? Colors.dark.cardMuted : Colors.light.cardMuted),
        },
        checkBox: {
            borderColor: isCompleted ? Colors.emerald : (isDarkMode ? Colors.dark.border : Colors.light.border),
            backgroundColor: isCompleted ? Colors.emerald : 'transparent',
        },
        text: {
            color: isCompleted ? (isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary) : (isDarkMode ? Colors.dark.text : Colors.light.text),
            textDecorationLine: textDecorationLineStyle,
        },
        icon: {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
        },
        deleteIcon: {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
        }
    };


    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <TouchableOpacity
                onPress={() => onToggle(habit.id)}
                style={styles.mainButton}
                aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
            >
                <View style={[styles.checkBox, dynamicStyles.checkBox]}>
                    {isCompleted && <CheckIcon size={16} color="#FFF" />}
                </View>
                <View style={styles.habitInfo}>
                    <View style={[styles.colorDot, { backgroundColor: habitColor.dot }]} />
                    <Text style={[styles.text, dynamicStyles.text]}>
                        {habit.name}
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => onEdit(habit)}
                    aria-label={`Edit habit: ${habit.name}`}
                    style={styles.actionButton}
                >
                    <PencilIcon size={20} color={dynamicStyles.icon.color} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onDelete(habit.id)}
                    aria-label={`Delete habit: ${habit.name}`}
                    style={styles.actionButton}
                >
                    <TrashIcon size={20} color={dynamicStyles.deleteIcon.color} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 6,
    },
    mainButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    checkBox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    habitInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    text: {
        fontSize: 16,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginLeft: 8,
    },
    actionButton: {
        padding: 4,
    }
});

export default HabitItem;
