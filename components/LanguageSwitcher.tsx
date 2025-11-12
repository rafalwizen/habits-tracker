import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';
import { useLanguage } from '@/i18n/LanguageContext';
import { Language } from '@/i18n/translations';
import { Colors } from '@/constants/Colors';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const colorScheme = useColorScheme() ?? 'light';
    const isDarkMode = colorScheme === 'dark';

    const languages: Language[] = ['en', 'pl'];

    const dynamicStyles = {
        container: {
            backgroundColor: isDarkMode ? Colors.dark.input : Colors.light.input,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        },
        button: {
            backgroundColor: isDarkMode ? Colors.dark.input : Colors.light.input,
        },
        activeButton: {
            backgroundColor: Colors.emerald,
        },
        text: {
            color: isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary,
        },
        activeText: {
            color: '#FFF',
        },
    };

    return (
        <View style={[styles.container, dynamicStyles.container]}>
            {languages.map((lang) => (
                <TouchableOpacity
                    key={lang}
                    style={[
                        styles.button,
                        dynamicStyles.button,
                        language === lang && dynamicStyles.activeButton,
                    ]}
                    onPress={() => setLanguage(lang)}
                >
                    <Text
                        style={[
                            styles.text,
                            dynamicStyles.text,
                            language === lang && dynamicStyles.activeText,
                        ]}
                    >
                        {lang.toUpperCase()}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 6,
        borderWidth: 1,
        overflow: 'hidden',
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default LanguageSwitcher;