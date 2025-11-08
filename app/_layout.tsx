import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, useColorScheme, StatusBar, Platform } from 'react-native';
import Header from '../components/Header';

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const styles = getStyles(isDarkMode);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={styles.container}>
                <Header />
                {children}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Built with ❤️ by a world-class React engineer.</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', // slate-900 or slate-100
    },
    container: {
        flex: 1,
    },
    footer: {
        padding: 16,
        marginTop: 32,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#64748b' // slate-500
    }
});


export default RootLayout;