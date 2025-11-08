import React from 'react';
import { Completions, Habit, HabitColor } from '../types';
import { formatDate } from '../utils/date';

// Define color schemes for the calendar heatmap
const colorSchemes: Record<HabitColor, string[]> = {
    emerald: [
        'bg-emerald-200 dark:bg-emerald-900',
        'bg-emerald-400 dark:bg-emerald-700',
        'bg-emerald-600 dark:bg-emerald-500',
        'bg-emerald-800 dark:bg-emerald-300'
    ],
    sky: [
        'bg-sky-200 dark:bg-sky-900',
        'bg-sky-400 dark:bg-sky-700',
        'bg-sky-600 dark:bg-sky-500',
        'bg-sky-800 dark:bg-sky-300'
    ],
    indigo: [
        'bg-indigo-200 dark:bg-indigo-900',
        'bg-indigo-400 dark:bg-indigo-700',
        'bg-indigo-600 dark:bg-indigo-500',
        'bg-indigo-800 dark:bg-indigo-300'
    ],
    rose: [
        'bg-rose-200 dark:bg-rose-900',
        'bg-rose-400 dark:bg-rose-700',
        'bg-rose-600 dark:bg-rose-500',
        'bg-rose-800 dark:bg-rose-300'
    ],
    amber: [
        'bg-amber-200 dark:bg-amber-900',
        'bg-amber-400 dark:bg-amber-700',
        'bg-amber-600 dark:bg-amber-500',
        'bg-amber-800 dark:bg-amber-300'
    ],
    violet: [
        'bg-violet-200 dark:bg-violet-900',
        'bg-violet-400 dark:bg-violet-700',
        'bg-violet-600 dark:bg-violet-500',
        'bg-violet-800 dark:bg-violet-300'
    ],
};

interface ProgressCalendarProps {
    habits: Habit[];
    completions: Completions;
    selectedHabitId: string | 'all';
    onSelectHabit: (id: string | 'all') => void;
}

const ProgressCalendar: React.FC<ProgressCalendarProps> = ({ habits, completions, selectedHabitId, onSelectHabit }) => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + (6 - today.getDay())); // end of week

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 83); // ~12 weeks

    const dateArray: Date[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const selectedHabit = habits.find(h => h.id === selectedHabitId);
    const habitColor = selectedHabit?.color || 'emerald';

    const baseIntensityClass = 'bg-slate-200 dark:bg-slate-700';
    const currentScheme = colorSchemes[habitColor] || colorSchemes.emerald;

    const intensityClasses = [
        baseIntensityClass,
        ...currentScheme,
    ];

    const getIntensity = (date: Date) => {
        const dateString = formatDate(date);
        const completionCount = completions[dateString]?.length || 0;
        if (completionCount === 0) return 0;

        // If a specific habit is selected, any completion marks it as the highest intensity
        if (selectedHabitId !== 'all') {
            return completionCount > 0 ? 4 : 0;
        }

        // For "All Habits", calculate percentage
        if (habits.length === 0) return 0;
        const percentage = completionCount / habits.length;
        if (percentage < 0.25) return 1;
        if (percentage < 0.5) return 2;
        if (percentage < 0.75) return 3;
        return 4;
    };

    const getMonthLabels = () => {
        const months: { name: string, colStart: number }[] = [];
        let lastMonth = -1;
        dateArray.forEach((date, i) => {
            const month = date.getMonth();
            if (month !== lastMonth && date.getDate() <= 7) {
                const col = Math.floor(i / 7) + 1;
                if (!months.some(m => m.colStart === col)) {
                    months.push({ name: date.toLocaleString('default', { month: 'short' }), colStart: col });
                }
            }
            lastMonth = month;
        });
        return months;
    };

    const monthLabels = getMonthLabels();

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 sm:mb-0">Progress</h2>
                <select
                    value={selectedHabitId}
                    onChange={(e) => onSelectHabit(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                >
                    <option value="all">All Habits</option>
                    {habits.map(habit => (
                        <option key={habit.id} value={habit.id}>{habit.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-flow-col gap-1" style={{gridTemplateRows: 'auto repeat(7, minmax(0, 1fr))', gridAutoColumns: 'minmax(0, 1fr)'}}>
                {monthLabels.map((month) => (
                    <div key={month.name} className="text-xs text-slate-500 dark:text-slate-400 text-center pb-1" style={{gridColumn: `${month.colStart} / span 4`, gridRow: 1 }}>
                        {month.name}
                    </div>
                ))}

                {weekDays.map((day, i) => (
                    <div key={day} className="text-xs text-slate-500 dark:text-slate-400 self-center" style={{gridRow: i + 2}}>
                        {i % 2 !== 0 ? day : ''}
                    </div>
                ))}
                {dateArray.map((date, i) => {
                    const intensity = getIntensity(date);
                    const dateString = formatDate(date);
                    return (
                        <div key={date.toISOString()} className="relative group aspect-square">
                            <div className={`w-full h-full rounded-[3px] ${intensityClasses[intensity]}`}></div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {dateString}: {completions[dateString]?.length || 0} completed
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-end items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
                <span>Less</span>
                {intensityClasses.map((cls, i) => <div key={i} className={`w-3 h-3 rounded-sm ${cls}`}></div>)}
                <span>More</span>
            </div>
        </div>
    );
};

export default ProgressCalendar;
