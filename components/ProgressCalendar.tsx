import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Completions, Habit, HabitColor } from '@/types';
import { formatDate } from '@/utils/date';
import { Colors } from '@/constants/Colors';
import { CheckIcon } from './Icons';


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

const ProgressCalendar: React.FC<ProgressCalendarProps> = ({ habits, completions, selectedHabitId, onSelectHabit }) => {
    const [modalVisible, setModalVisible] = useState(false);
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

    const selectedHabit = habits.find(h => h.id === selectedHabitId);
    const habitColor = selectedHabit?.color || 'emerald';

    const baseIntensityClass = isDarkMode ? Colors.dark.cardMuted : Colors.light.cardMuted;
    const currentScheme = colorSchemes[habitColor] || colorSchemes.emerald;

    const intensityClasses = [baseIntensityClass, ...currentScheme];

    const getIntensity = (date: Date) => {
        const dateString = formatDate(date);
        const completionCount = completions[dateString]?.length || 0;
        if (completionCount === 0) return 0;

        if (selectedHabitId !== 'all') {
            return completions[dateString]?.includes(selectedHabitId) ? 4 : 0;
        }

        if (habits.length === 0) return 0;
        const percentage = completionCount / habits.length;
        if (percentage < 0.25) return 1;
        if (percentage < 0.5) return 2;
        if (percentage < 0.75) return 3;
        return 4;
    };

    const dynamicStyles = {
        container: { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card },
        title: { color: isDarkMode ? Colors.dark.text : Colors.light.text },
        pickerButton: { backgroundColor: isDarkMode ? Colors.dark.input : Colors.light.input, borderColor: isDarkMode ? Colors.dark.border : Colors.light.border },
        pickerText: { color: isDarkMode ? Colors.dark.text : Colors.light.text },
        weekdayText: { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary },
        legendText: { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary },
        modalView: { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card },
        modalTitle: { color: isDarkMode ? Colors.dark.text : Colors.light.text },
        optionText: { color: isDarkMode ? Colors.dark.text : Colors.light.text },
        separator: { backgroundColor: isDarkMode ? Colors.dark.border : Colors.light.border },
        closeButton: { backgroundColor: isDarkMode ? Colors.dark.input : Colors.light.input },
        closeButtonText: { color: isDarkMode ? Colors.dark.text : Colors.light.text }
    };

    const PickerModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={[styles.modalView, dynamicStyles.modalView]}>
                    <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>Select Habit</Text>
                    <FlatList
                        data={[{ id: 'all', name: 'All Habits' }, ...habits]}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={() => <View style={[styles.separator, dynamicStyles.separator]} />}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.option} onPress={() => {
                                onSelectHabit(item.id);
                                setModalVisible(false);
                            }}>
                                <Text style={[styles.optionText, dynamicStyles.optionText]}>{item.name}</Text>
                                {selectedHabitId === item.id && <CheckIcon size={20} color={Colors.emerald} />}
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={[styles.closeButton, dynamicStyles.closeButton]} onPress={() => setModalVisible(false)}>
                        <Text style={[styles.closeButtonText, dynamicStyles.closeButtonText]}>Close</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    );

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <PickerModal />
            <View style={styles.header}>
                <Text style={[styles.title, dynamicStyles.title]}>Progress</Text>
                <TouchableOpacity style={[styles.pickerButton, dynamicStyles.pickerButton]} onPress={() => setModalVisible(true)}>
                    <Text style={[styles.pickerText, dynamicStyles.pickerText]}>{selectedHabit ? selectedHabit.name : 'All Habits'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>
                <View style={styles.weekdaysContainer}>
                    {weekDays.map((day, i) => <Text key={day} style={[styles.weekdayText, dynamicStyles.weekdayText, { opacity: i % 2 !== 0 ? 1 : 0 }]}>{day}</Text>)}
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.grid}>
                        {dateArray.map(date => (
                            <View key={date.toISOString()} style={[styles.dayCell, { backgroundColor: intensityClasses[getIntensity(date)] }]} />
                        ))}
                    </View>
                </ScrollView>
            </View>
            <View style={styles.legend}>
                <Text style={[styles.legendText, dynamicStyles.legendText]}>Less</Text>
                {intensityClasses.map((c, i) => <View key={i} style={[styles.legendCell, {backgroundColor: c}]} />)}
                <Text style={[styles.legendText, dynamicStyles.legendText]}>More</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 18, fontWeight: '600' },
    pickerButton: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
    pickerText: { fontSize: 14 },
    calendarContainer: { flexDirection: 'row', gap: 10 },
    weekdaysContainer: { gap: 6 },
    weekdayText: { fontSize: 12, height: 12 },
    grid: { height: 12 * 7 + 6 * 6, flexDirection: 'column', flexWrap: 'wrap', gap: 6 },
    dayCell: { width: 12, height: 12, borderRadius: 2 },
    legend: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 8 },
    legendText: { fontSize: 12 },
    legendCell: { width: 12, height: 12, borderRadius: 2 },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: 16, maxHeight: '50%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    option: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, alignItems: 'center' },
    optionText: { fontSize: 18 },
    separator: { height: 1 },
    closeButton: { marginTop: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
    closeButtonText: { fontSize: 18, fontWeight: '600' }
});

export default ProgressCalendar;
