import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        const loadStoredValue = async () => {
            try {
                const item = await AsyncStorage.getItem(key);
                if (item !== null) {
                    setStoredValue(JSON.parse(item));
                } else {
                    setStoredValue(initialValue);
                }
            } catch (error) {
                console.error(`Error reading value for key "${key}" from AsyncStorage:`, error);
                setStoredValue(initialValue);
            }
        };

        loadStoredValue();
    }, [key, initialValue]);

    const setValue: Dispatch<SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            AsyncStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error saving value for key "${key}" to AsyncStorage:`, error);
        }
    };

    return [storedValue, setValue];
}
