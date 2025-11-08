import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, useColorScheme, Pressable } from 'react-native';
import { Habit, HABIT_COLORS, HabitColor } from '../types';

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


interface EditHabitModalProps {
    habit: Habit;
    onUpdate: (id: string, newName: string, newColor: HabitColor) => void;
    onClose: () => void;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, onUpdate, onClose }) => {
    const [name, setName] = useState(habit.name);
    const [color, setColor] = useState<HabitColor>(habit.color);
    const isDarkMode = useColorScheme() === 'dark';
    const componentStyles = getStyles(isDarkMode);

    useEffect(() => {
        setName(habit.name);
        setColor(habit.color);
    }, [habit]);

    const handleSubmit = () => {
        if (name.trim()) {
            onUpdate(habit.id, name, color);
        }
    };

    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={onClose}
            animationType="fade"
        >
            <Pressable
                style={componentStyles.overlay}
                onPress={onClose}
            >
                <Pressable style={componentStyles.modalContainer}>
                    <Text style={componentStyles.title}>Edit Habit</Text>
                    <View style={componentStyles.form}>
                        <View>
                            <Text style={componentStyles.label}>Habit Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                style={componentStyles.input}
                            />
                        </View>
                        <View>
                            <Text style={componentStyles.label}>Color</Text>
                            <ColorPicker selectedColor={color} onSelectColor={setColor} />
                        </View>
                        <View style={componentStyles.buttonContainer}>
                            <TouchableOpacity
                                onPress={onClose}
                                style={[componentStyles.button, componentStyles.cancelButton]}
                            >
                                <Text style={componentStyles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={[componentStyles.button, componentStyles.saveButton, !name.trim() && componentStyles.buttonDisabled]}
                                disabled={!name.trim()}
                            >
                                <Text style={componentStyles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    colorPickerContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, },
    colorButton: { width: 28, height: 28, borderRadius: 14, },
    colorButtonSelectedLight: { borderWidth: 2, borderColor: '#0f172a', }, // slate-900
    colorButtonSelectedDark: { borderWidth: 2, borderColor: '#fff', }
});

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 16, },
    modalContainer: { backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderRadius: 8, padding: 24, width: '100%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: isDarkMode ? '#f1f5f9' : '#1e293b', },
    form: { gap: 24, },
    label: { fontSize: 14, fontWeight: '500', color: isDarkMode ? '#cbd5e1' : '#334155', marginBottom: 4, },
    input: { width: '100%', backgroundColor: isDarkMode ? '#334155' : '#f1f5f9', color: isDarkMode ? '#e2e8f0' : '#1e293b', borderWidth: 1, borderColor: isDarkMode ? '#475569' : '#cbd5e1', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, fontSize: 16, },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, paddingTop: 8, },
    button: { borderRadius: 6, paddingVertical: 10, paddingHorizontal: 16, },
    buttonDisabled: { opacity: 0.5 },
    cancelButton: { backgroundColor: isDarkMode ? '#334155' : '#e2e8f0' },
    cancelButtonText: { color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: '600' },
    saveButton: { backgroundColor: '#10b981' },
    saveButtonText: { color: '#fff', fontWeight: '600' },
});


export default EditHabitModal;