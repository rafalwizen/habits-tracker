import React, { useState } from 'react';
// Fix: Import ScrollView which was missing.
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Modal, FlatList, Pressable, ScrollView } from 'react-native';
import { Completions, Habit, HabitColor } from '../types';
import { formatDate } from '../utils/date';

// Define color schemes for the calendar heatmap
const colorSchemes: Record<HabitColor, string[]> = {
    emerald: ['#a7f3d0', '#6ee7b7', '#34d399', '#10b981'],
    sky: ['#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9'],
    indigo: ['#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1'],
    rose: ['#fecdd3', '#fda4af', '#fb7185', '#f43f5e'],
    amber: ['#fde68a', '#fcd34d', '#fbbf24', '#f59e0b'],
    violet: ['#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6'],
};

const HabitPicker: React.FC<{ habits: Habit[], selectedHabitId: string | 'all', onSelectHabit: (id: string | 'all') => void, isDarkMode: boolean }> = ({ habits, selectedHabitId, onSelectHabit, isDarkMode }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const styles = getPickerStyles(isDarkMode);

    const selectedHabitName = selectedHabitId === 'all'
        ? 'All Habits'
        : habits.find(h => h.id === selectedHabitId)?.name;

    // Fix: Widen the type of `item` to match what FlatList infers due to type widening of string literals.
    const renderItem = ({ item }: { item: Habit | { id: string; name: string; } }) => (
        <TouchableOpacity
            style={styles.option}
            onPress={() => {
                onSelectHabit(item.id);
                setModalVisible(false);
            }}>
            <Text style={styles.optionText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.pickerButtonText}>{selectedHabitName}</Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={[{ id: 'all', name: 'All Habits' }, ...habits]}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const ProgressCalendar: React.FC<Omit<ProgressCalendarProps, 'isDarkMode'>> = ({ habits, completions, selectedHabitId, onSelectHabit }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const styles = getStyles(isDarkMode);

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - today.getDay())); // end of week

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 83); // ~12 weeks

    const dateArray: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const selectedHabit = habits.find(h => h.id === selectedHabitId);
    const habitColor = selectedHabit?.color || 'emerald';

    const baseIntensityColor = isDarkMode ? '#334155' : '#e2e8f0'; // slate-700 or slate-200
    const currentScheme = colorSchemes[habitColor] || colorSchemes.emerald;

    const intensityColors = [baseIntensityColor, ...currentScheme];

    const getIntensity = (date: Date) => {
        const dateString = formatDate(date);
        const completionCount = completions[dateString]?.length || 0;
        if (completionCount === 0) return 0;
        if (selectedHabitId !== 'all') return completionCount > 0 ? 4 : 0;
        if (habits.length === 0) return 0;
        const percentage = completionCount / habits.length;
        if (percentage < 0.25) return 1;
        if (percentage < 0.5) return 2;
        if (percentage < 0.75) return 3;
        return 4;
    };

    const weeks = dateArray.reduce((acc, date, i) => {
        if (i % 7 === 0) acc.push([]);
        acc[acc.length - 1].push(date);
        return acc;
    }, [] as Date[][]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Progress</Text>
                <HabitPicker habits={habits} selectedHabitId={selectedHabitId} onSelectHabit={onSelectHabit} isDarkMode={isDarkMode}/>
            </View>

            <View style={styles.calendarContainer}>
                <View>
                    {weekDays.map((day, i) => (
                        <Text key={day} style={styles.dayLabel}>
                            {i % 2 !== 0 ? day : ''}
                        </Text>
                    ))}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.grid}>
                        {weeks.map((week, weekIndex) => (
                            <View key={weekIndex} style={styles.column}>
                                {week.map(date => {
                                    const intensity = getIntensity(date);
                                    return (
                                        <View key={date.toISOString()} style={[styles.cell, { backgroundColor: intensityColors[intensity] }]} />
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <View style={styles.legend}>
                <Text style={styles.legendText}>Less</Text>
                {intensityColors.map((color, i) => <View key={i} style={[styles.legendCell, { backgroundColor: color }]} />)}
                <Text style={styles.legendText}>More</Text>
            </View>
        </View>
    );
};

interface ProgressCalendarProps {
    habits: Habit[];
    completions: Completions;
    selectedHabitId: string | 'all';
    onSelectHabit: (id: string | 'all') => void;
    isDarkMode: boolean;
}

const getPickerStyles = (isDarkMode: boolean) => StyleSheet.create({
    pickerButton: {
        backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
        borderWidth: 1,
        borderColor: isDarkMode ? '#475569' : '#cbd5e1',
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    pickerButtonText: {
        color: isDarkMode ? '#e2e8f0' : '#1e293b',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: isDarkMode ? '#1e293b' : '#fff',
        borderRadius: 8,
        padding: 16,
        width: '80%',
        maxHeight: '60%',
    },
    option: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? '#334155' : '#f1f5f9',
    },
    optionText: {
        color: isDarkMode ? '#e2e8f0' : '#1e293b',
        fontSize: 16,
    }
});

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    container: { backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2, },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, },
    title: { fontSize: 18, fontWeight: '600', color: isDarkMode ? '#e2e8f0' : '#1e293b', },
    calendarContainer: { flexDirection: 'row', },
    dayLabel: { fontSize: 12, color: '#64748b', flex: 1, textAlign: 'center' },
    grid: { flexDirection: 'row', gap: 4, },
    column: { gap: 4, },
    cell: { width: 12, height: 12, borderRadius: 3, },
    legend: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 16, },
    legendText: { fontSize: 12, color: '#64748b', },
    legendCell: { width: 12, height: 12, borderRadius: 2, },
});

export default ProgressCalendar;