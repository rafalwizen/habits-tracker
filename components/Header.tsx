import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Zenith Habit Tracker</h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
