import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, translations, Translations } from './translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@zenith_language';

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('en');
    const [isLoading, setIsLoading] = useState(true);

    // Load saved language on mount
    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (savedLanguage === 'en' || savedLanguage === 'pl') {
                setLanguageState(savedLanguage);
            }
        } catch (error) {
            console.error('Failed to load language:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Failed to save language:', error);
        }
    };

    const value: LanguageContextType = {
        language,
        setLanguage,
        t: translations[language],
    };

    // Don't render children until language is loaded
    if (isLoading) {
        return null;
    }

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};