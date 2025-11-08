import React from 'react';
import Header from '../components/Header';

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <Header />
            {children}
            <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
                <p>Built with ❤️ by a world-class React engineer.</p>
            </footer>
        </div>
    );
};

export default RootLayout;
