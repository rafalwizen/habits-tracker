import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { PlusIcon } from './Icons';
import { HABIT_COLORS, HabitColor, DEFAULT_HABIT_COLOR } from '../types';

// A simple reusable color picker component
const ColorPicker: React.FC<{ selectedColor: HabitColor; onSelectColor: (color: HabitColor) => void; }> = ({ selectedColor, onSelectColor }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const colorValues: Record<HabitColor, string> = {
        emerald: '#10b981', sky: '#0ea5e9', indigo: '#6366f1',
        rose: '#f43f5e', amber: '#f59e0b', violet: '#8b5cf6',
    };

    return (
        <View style={styles.colorPickerContainer}>
            {HABIT_COLORS.map(color => (
                <TouchableOpacity
                    key={color}
                    onPress={() => onSelectColor(color)}
                    style={[
                        styles.colorButton,
                        { backgroundColor: colorValues[color] },
                        selectedColor === color && (isDarkMode ? styles.colorButtonSelectedDark : styles.colorButtonSelectedLight)
                    ]}
                    aria-label={`Select color ${color}`}
                />
            ))}
        </View>
    );
};


interface AddHabitFormProps {
    onAddHabit: (name: string, color: HabitColor) => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAddHabit }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState<HabitColor>(DEFAULT_HABIT_COLOR);
    const isDarkMode = useColorScheme() === 'dark';
    const componentStyles = getStyles(isDarkMode);

    const handleSubmit = () => {
        onAddHabit(name, color);
        setName('');
        setColor(DEFAULT_HABIT_COLOR);
    };

    return (
        <View style={componentStyles.container}>
            <Text style={componentStyles.title}>Add New Habit</Text>
            <View style={componentStyles.form}>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Meditate for 10 minutes"
                    placeholderTextColor={isDarkMode ? '#94a3b8' : '#64748b'}
                    style={componentStyles.input}
                />
                <ColorPicker selectedColor={color} onSelectColor={setColor} />
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={[componentStyles.button, !name.trim() && componentStyles.buttonDisabled]}
                    disabled={!name.trim()}
                >
                    <PlusIcon size={20} color="white" />
                    <Text style={componentStyles.buttonText}>Add Habit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    colorPickerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
    },
    colorButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    colorButtonSelectedLight: {
        borderWidth: 2,
        borderColor: '#0f172a', // slate-900
    },
    colorButtonSelectedDark: {
        borderWidth: 2,
        borderColor: '#fff',
    }
});

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        backgroundColor: isDarkMode ? '#1e293b' : '#fff', // dark:bg-slate-800
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2,
        gap: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: isDarkMode ? '#e2e8f0' : '#1e293b', // dark:text-slate-200
    },
    form: {
        gap: 16,
    },
    input: {
        width: '100%',
        backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', // dark:bg-slate-700
        color: isDarkMode ? '#e2e8f0' : '#1e293b', // dark:text-slate-200
        borderWidth: 1,
        borderColor: isDarkMode ? '#475569' : '#cbd5e1', // dark:border-slate-600
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#10b981', // emerald-500
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    }
});


export default AddHabitForm;