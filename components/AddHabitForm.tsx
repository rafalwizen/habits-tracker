import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { PlusIcon } from './Icons';
import { HABIT_COLORS, HabitColor, DEFAULT_HABIT_COLOR } from '@/types';
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

interface AddHabitFormProps {
    onAddHabit: (name: string, color: HabitColor) => void;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAddHabit }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState<HabitColor>(DEFAULT_HABIT_COLOR);
    const colorScheme = useColorScheme() ?? 'light';
    const isDarkMode = colorScheme === 'dark';
    const { t } = useLanguage();

    const handleSubmit = () => {
        if (name.trim()) {
            onAddHabit(name, color);
            setName('');
            setColor(DEFAULT_HABIT_COLOR);
        }
    };

    const dynamicStyles = {
        container: {
            backgroundColor: isDarkMode ? Colors.dark.card : Colors.light.card,
        },
        title: {
            color: isDarkMode ? Colors.dark.text : Colors.light.text,
        },
        input: {
            backgroundColor: isDarkMode ? Colors.dark.input : Colors.light.input,
            color: isDarkMode ? Colors.dark.text : Colors.light.text,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        },
        buttonDisabled: {
            backgroundColor: `${Colors.emerald}80`, // 50% opacity
        }
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            <Text style={[styles.title, dynamicStyles.title]}>{t.addNewHabit}</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t.habitPlaceholder}
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
                style={[styles.input, dynamicStyles.input]}
            />
            <View style={styles.colorSelector}>
                {HABIT_COLORS.map(c => (
                    <TouchableOpacity
                        key={c}
                        onPress={() => setColor(c)}
                        style={[
                            styles.colorButton,
                            { backgroundColor: colorClasses[c].bg },
                            color === c && {
                                borderColor: colorClasses[c].ring,
                                borderWidth: 2,
                            },
                        ]}
                        aria-label={`${t.selectColor} ${c}`}
                    />
                ))}
            </View>
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!name.trim()}
                style={[styles.button, !name.trim() && dynamicStyles.buttonDisabled]}
            >
                <PlusIcon size={20} color="#FFF" />
                <Text style={styles.buttonText}>{t.addHabitButton}</Text>
            </TouchableOpacity>
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
    input: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 16,
    },
    colorSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 16,
    },
    colorButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    button: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.emerald,
        borderRadius: 6,
        paddingVertical: 12,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
});

export default AddHabitForm;