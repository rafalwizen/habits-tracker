import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    useColorScheme,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import Header from '../components/Header';
import { Colors } from '@/constants/Colors';

export default function Layout() {
    const colorScheme = useColorScheme() ?? 'light';
    const isDarkMode = colorScheme === 'dark';

    const backgroundColor = isDarkMode
        ? Colors.dark.background
        : Colors.light.background;
    const textColor = isDarkMode
        ? Colors.dark.textSecondary
        : Colors.light.textSecondary;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top', 'bottom']}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <Header />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={[styles.scrollView, { backgroundColor }]}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.mainContent}>
                    <Slot />
                </View>
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: textColor }]}>
                        Built with ❤️ by a world-class React engineer.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    mainContent: {
        padding: 16,
    },
    footer: {
        alignItems: 'center',
        padding: 16,
        marginTop: 24,
    },
    footerText: {
        fontSize: 12,
    },
});