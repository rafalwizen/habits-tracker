import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Habit, HabitColor } from '@/types';
import HabitItem from './HabitItem';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/i18n/LanguageContext';

interface HabitListProps {
    habits: Habit[];
    completions: string[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (habit: Habit) => void;
}

const colorClasses: Record<HabitColor, { border: string; bg: string }> = {
    emerald: { border: Colors.emerald, bg: 'rgba(16, 185, 129, 0.05)' },
    sky: { border: Colors.sky, bg: 'rgba(14, 165, 233, 0.05)' },
    indigo: { border: Colors.indigo, bg: 'rgba(99, 102, 241, 0.05)' },
    rose: { border: Colors.rose, bg: 'rgba(244, 63, 94, 0.05)' },
    amber: { border: Colors.amber, bg: 'rgba(245, 158, 11, 0.05)' },
    violet: { border: Colors.violet, bg: 'rgba(139, 92, 246, 0.05)' },
};

const HabitList: React.FC<HabitListProps> = ({ habits, completions, onToggle, onDelete, onEdit }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const isDarkMode = colorScheme === 'dark';
    const { t } = useLanguage();

    const dynamicStyles = {
        sectionTitle: {
            color: isDarkMode ? Colors.dark.text : Colors.light.text,
        },
        emptyCard: {
            backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card,
        },
        emptyText: {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
        },
    };

    if (habits.length === 0) {
        return (
            <View>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t.todaysHabits}</Text>
                <View style={[styles.emptyCard, dynamicStyles.emptyCard]}>
                    <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                        {t.noHabitsYet}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t.todaysHabits}</Text>
            <View style={styles.habitCardsContainer}>
                {habits.map(habit => {
                    const habitColorScheme = colorClasses[habit.color];
                    return (
                        <View
                            key={habit.id}
                            style={[
                                styles.habitCard,
                                {
                                    borderColor: habitColorScheme.border,
                                    backgroundColor: habitColorScheme.bg,
                                },
                            ]}
                        >
                            <HabitItem
                                habit={habit}
                                isCompleted={completions.includes(habit.id)}
                                onToggle={onToggle}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    habitCardsContainer: {
        gap: 12,
    },
    habitCard: {
        borderRadius: 8,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        overflow: 'hidden',
    },
    emptyCard: {
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
    },
});

export default HabitList;