import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Completions, Habit, HabitColor } from '@/types';
import { formatDate } from '@/utils/date';
import { Colors } from '@/constants/Colors';

const colorSchemes: Record<HabitColor, string[]> = {
    emerald: [Colors.emerald_tint_1, Colors.emerald_tint_2, Colors.emerald_tint_3, Colors.emerald],
    sky: [Colors.sky_tint_1, Colors.sky_tint_2, Colors.sky_tint_3, Colors.sky],
    indigo: [Colors.indigo_tint_1, Colors.indigo_tint_2, Colors.indigo_tint_3, Colors.indigo],
    rose: [Colors.rose_tint_1, Colors.rose_tint_2, Colors.rose_tint_3, Colors.rose],
    amber: [Colors.amber_tint_1, Colors.amber_tint_2, Colors.amber_tint_3, Colors.amber],
    violet: [Colors.violet_tint_1, Colors.violet_tint_2, Colors.violet_tint_3, Colors.violet],
};

interface ProgressCalendarProps {
    habits: Habit[];
    completions: Completions;
    selectedHabitId: string | 'all';
    onSelectHabit: (id: string | 'all') => void;
}

const ProgressCalendar: React.FC<ProgressCalendarProps> = ({ habits, completions }) => {
    const [viewMode, setViewMode] = useState<'combined' | 'separate'>('separate');
    const colorScheme = useColorScheme() ?? 'light';
    const isDarkMode = colorScheme === 'dark';

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - today.getDay()));

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 83);

    const dateArray: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const baseIntensityClass = isDarkMode ? Colors.dark.cardMuted : Colors.light.cardMuted;

    const getIntensityForHabit = (date: Date, habitId: string) => {
        const dateString = formatDate(date);
        return completions[dateString]?.includes(habitId) ? 1 : 0;
    };

    const getCombinedIntensity = (date: Date) => {
        const dateString = formatDate(date);
        const completionCount = completions[dateString]?.length || 0;
        if (completionCount === 0) return 0;
        if (habits.length === 0) return 0;

        const percentage = completionCount / habits.length;
        if (percentage < 0.25) return 1;
        if (percentage < 0.5) return 2;
        if (percentage < 0.75) return 3;
        return 4;
    };

    const dynamicStyles = {
        container: { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card },
        sectionTitle: { color: isDarkMode ? Colors.dark.text : Colors.light.text },
        habitTitle: { color: isDarkMode ? Colors.dark.text : Colors.light.text },
        weekdayText: { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary },
        legendText: { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary },
        emptyText: { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary },
        switcherButton: {
            backgroundColor: isDarkMode ? Colors.dark.input : Colors.light.input,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        },
        switcherButtonActive: {
            backgroundColor: Colors.emerald,
        },
        switcherTextInactive: {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
        },
    };

    if (habits.length === 0) {
        return (
            <View style={[styles.container, dynamicStyles.container]}>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Progress</Text>
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                        Add habits to see your progress!
                    </Text>
                </View>
            </View>
        );
    }

    const renderCombinedView = () => {
        const currentScheme = colorSchemes.emerald;
        const intensityClasses = [baseIntensityClass, ...currentScheme];

        return (
            <View style={[styles.habitCalendarCard, dynamicStyles.container]}>
                <Text style={[styles.habitTitle, dynamicStyles.habitTitle]}>All Habits Combined</Text>

                <View style={styles.calendarContainer}>
                    <View style={styles.weekdaysContainer}>
                        {weekDays.map((day, i) => (
                            <Text
                                key={day}
                                style={[
                                    styles.weekdayText,
                                    dynamicStyles.weekdayText,
                                    { opacity: i % 2 !== 0 ? 1 : 0 }
                                ]}
                            >
                                {day}
                            </Text>
                        ))}
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.grid}>
                            {dateArray.map(date => {
                                const intensity = getCombinedIntensity(date);
                                return (
                                    <View
                                        key={date.toISOString()}
                                        style={[
                                            styles.dayCell,
                                            { backgroundColor: intensityClasses[intensity] }
                                        ]}
                                    />
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.legend}>
                    <Text style={[styles.legendText, dynamicStyles.legendText]}>Less</Text>
                    {intensityClasses.map((c, i) => (
                        <View key={i} style={[styles.legendCell, {backgroundColor: c}]} />
                    ))}
                    <Text style={[styles.legendText, dynamicStyles.legendText]}>More</Text>
                </View>
            </View>
        );
    };

    const renderSeparateView = () => {
        return habits.map(habit => {
            const currentScheme = colorSchemes[habit.color] || colorSchemes.emerald;
            const intensityClasses = [baseIntensityClass, currentScheme[3]];

            return (
                <View key={habit.id} style={[styles.habitCalendarCard, dynamicStyles.container]}>
                    <Text style={[styles.habitTitle, dynamicStyles.habitTitle]}>{habit.name}</Text>

                    <View style={styles.calendarContainer}>
                        <View style={styles.weekdaysContainer}>
                            {weekDays.map((day, i) => (
                                <Text
                                    key={day}
                                    style={[
                                        styles.weekdayText,
                                        dynamicStyles.weekdayText,
                                        { opacity: i % 2 !== 0 ? 1 : 0 }
                                    ]}
                                >
                                    {day}
                                </Text>
                            ))}
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.grid}>
                                {dateArray.map(date => {
                                    const intensity = getIntensityForHabit(date, habit.id);
                                    return (
                                        <View
                                            key={date.toISOString()}
                                            style={[
                                                styles.dayCell,
                                                { backgroundColor: intensityClasses[intensity] }
                                            ]}
                                        />
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.legend}>
                        <Text style={[styles.legendText, dynamicStyles.legendText]}>Incomplete</Text>
                        <View style={[styles.legendCell, {backgroundColor: intensityClasses[0]}]} />
                        <View style={[styles.legendCell, {backgroundColor: intensityClasses[1]}]} />
                        <Text style={[styles.legendText, dynamicStyles.legendText]}>Complete</Text>
                    </View>
                </View>
            );
        });
    };

    return (
        <View>
            <View style={styles.header}>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Progress</Text>
                <View style={styles.switcher}>
                    <TouchableOpacity
                        style={[
                            styles.switcherButton,
                            dynamicStyles.switcherButton,
                            viewMode === 'combined' && dynamicStyles.switcherButtonActive
                        ]}
                        onPress={() => setViewMode('combined')}
                    >
                        <Text style={[
                            styles.switcherText,
                            viewMode !== 'combined' && dynamicStyles.switcherTextInactive,
                            viewMode === 'combined' && styles.switcherTextActive
                        ]}>
                            Combined
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.switcherButton,
                            dynamicStyles.switcherButton,
                            viewMode === 'separate' && dynamicStyles.switcherButtonActive
                        ]}
                        onPress={() => setViewMode('separate')}
                    >
                        <Text style={[
                            styles.switcherText,
                            viewMode !== 'separate' && dynamicStyles.switcherTextInactive,
                            viewMode === 'separate' && styles.switcherTextActive
                        ]}>
                            Separate
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.calendarsContainer}>
                {viewMode === 'combined' ? renderCombinedView() : renderSeparateView()}
            </View>
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
        elevation: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    switcher: {
        flexDirection: 'row',
        borderRadius: 6,
        overflow: 'hidden',
    },
    switcherButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
    },
    switcherText: {
        fontSize: 14,
        fontWeight: '500',
    },
    switcherTextActive: {
        color: '#FFF',
    },
    calendarsContainer: {
        gap: 16,
    },
    habitCalendarCard: {
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    habitTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    calendarContainer: {
        flexDirection: 'row',
        gap: 10
    },
    weekdaysContainer: {
        gap: 6
    },
    weekdayText: {
        fontSize: 12,
        height: 12
    },
    grid: {
        height: 12 * 7 + 6 * 6,
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 6
    },
    dayCell: {
        width: 12,
        height: 12,
        borderRadius: 2
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 4,
        marginTop: 8
    },
    legendText: {
        fontSize: 12
    },
    legendCell: {
        width: 12,
        height: 12,
        borderRadius: 2
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
    },
});

export default ProgressCalendar;