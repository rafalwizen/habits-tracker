import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const Header: React.FC = () => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const styles = getStyles(isDarkMode);

    return (
        <View style={styles.header}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <Path d="m9 12 2 2 4-4" />
                    </Svg>
                    <Text style={styles.title}>Zenith Habit Tracker</Text>
                </View>
            </View>
        </View>
    );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    header: {
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)', // slate-800/80 or white/80
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    container: {
        maxWidth: 1024,
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 64, // h-16
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
        color: isDarkMode ? '#fff' : '#0f172a', // dark:text-white or text-slate-900
    }
});

export default Header;