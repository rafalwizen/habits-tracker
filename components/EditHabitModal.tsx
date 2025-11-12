import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { Habit, HABIT_COLORS, HabitColor } from '@/types';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/i18n/LanguageContext';

const colorClasses: Record<HabitColor, { bg: string; ring: string }> = {
    emerald: { bg: Colors.emerald, ring: '#6ee7b7' },
    sky: { bg: Colors.sky, ring: '#7dd3fc' },
    indigo: { bg: Colors.indigo, ring: '#a5b4fc' },
    rose: { bg: Colors.rose, ring: '#fca5a5' },
    amber: { bg: Colors.amber, ring: '#fcd34d' },
    violet: { bg: Colors.violet, ring: '#c4b5fd' },
};

interface EditHabitModalProps {
    habit: Habit;
    onUpdate: (id: string, newName: string, newColor: HabitColor) => void;
    onClose: () => void;
}

const EditHabitModal: React.FC<EditHabitModalProps> = ({ habit, onUpdate, onClose }) => {
    const [name, setName] = useState(habit.name);
    const [color, setColor] = useState<HabitColor>(habit.color);
    const colorScheme = useColorScheme() ?? 'light';
    const isDarkMode = colorScheme === 'dark';
    const { t } = useLanguage();

    useEffect(() => {
        setName(habit.name);
        setColor(habit.color);
    }, [habit]);

    const handleSubmit = () => {
        if (name.trim()) {
            onUpdate(habit.id, name, color);
        }
    };

    const dynamicStyles = {
        modalView: { backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card },
        title: { color: isDarkMode ? Colors.dark.text : Colors.light.text },
        label: { color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary },
        input: { backgroundColor: isDarkMode ? Colors.dark.input : Colors.light.input, color: isDarkMode ? Colors.dark.text : Colors.light.text, borderColor: isDarkMode ? Colors.dark.border : Colors.light.border },
        cancelButton: { backgroundColor: isDarkMode ? Colors.dark.input : Colors.light.input },
        cancelButtonText: { color: isDarkMode ? Colors.dark.text : Colors.light.text },
        saveButtonDisabled: { backgroundColor: `${Colors.emerald}80` }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.centeredView}
            >
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={[styles.modalView, dynamicStyles.modalView]}>
                    <Text style={[styles.title, dynamicStyles.title]}>{t.editHabitTitle}</Text>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, dynamicStyles.label]}>{t.habitName}</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={[styles.input, dynamicStyles.input]}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[styles.label, dynamicStyles.label]}>{t.color}</Text>
                        <View style={styles.colorSelector}>
                            {HABIT_COLORS.map(c => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() => setColor(c)}
                                    style={[
                                        styles.colorButton,
                                        { backgroundColor: colorClasses[c].bg },
                                        color === c && { borderColor: colorClasses[c].ring, borderWidth: 2 }
                                    ]}
                                    aria-label={`${t.selectColor} ${c}`}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton, dynamicStyles.cancelButton]}>
                            <Text style={[styles.buttonText, dynamicStyles.cancelButtonText]}>{t.cancel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!name.trim()}
                            style={[styles.button, styles.saveButton, !name.trim() && dynamicStyles.saveButtonDisabled]}
                        >
                            <Text style={[styles.buttonText, {color: '#fff'}]}>{t.saveChanges}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 16,
    },
    modalView: {
        width: '100%',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    colorSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    colorButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        paddingTop: 16,
    },
    button: {
        borderRadius: 6,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    cancelButton: {},
    saveButton: {
        backgroundColor: Colors.emerald,
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
        textAlign: 'center',
    }
});

export default EditHabitModal;