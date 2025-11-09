import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

const Header: React.FC = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const isDarkMode = colorScheme === 'dark';

    return (
        <View style={[styles.header, { backgroundColor: isDarkMode ? Colors.dark.header : Colors.light.header, borderBottomColor: isDarkMode ? Colors.dark.border : Colors.light.border }]}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Svg
                        width={32}
                        height={32}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={Colors.emerald}
                        strokeWidth={2}
                    >
                        <Path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </Svg>
                    <Text style={[styles.title, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}>
                        Zenith Habit Tracker
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 64,
        justifyContent: 'center',
        borderBottomWidth: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 12,
    },
});

export default Header;
