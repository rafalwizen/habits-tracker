export type Language = 'en' | 'pl';

export interface Translations {
    // Header
    appTitle: string;

    // Add Habit Form
    addNewHabit: string;
    habitPlaceholder: string;
    selectColor: string;
    addHabitButton: string;

    // Habit List
    todaysHabits: string;
    noHabitsYet: string;
    markAsComplete: string;
    markAsIncomplete: string;
    editHabit: string;
    deleteHabit: string;

    // Edit Modal
    editHabitTitle: string;
    habitName: string;
    color: string;
    cancel: string;
    saveChanges: string;

    // Progress Calendar
    progress: string;
    addHabitsToSeeProgress: string;
    allHabitsCombined: string;
    less: string;
    more: string;
    incomplete: string;
    complete: string;
    combined: string;
    separate: string;

    // Weekdays
    weekdays: {
        sun: string;
        mon: string;
        tue: string;
        wed: string;
        thu: string;
        fri: string;
        sat: string;
    };

    // Footer
    footerText: string;
}

export const translations: Record<Language, Translations> = {
    en: {
        appTitle: 'Zenith Habit Tracker',
        addNewHabit: 'Add New Habit',
        habitPlaceholder: 'e.g., Meditate for 10 minutes',
        selectColor: 'Select color',
        addHabitButton: 'Add Habit',
        todaysHabits: "Today's Habits",
        noHabitsYet: 'No habits yet. Add one to get started!',
        markAsComplete: 'Mark as complete',
        markAsIncomplete: 'Mark as incomplete',
        editHabit: 'Edit habit',
        deleteHabit: 'Delete habit',
        editHabitTitle: 'Edit Habit',
        habitName: 'Habit Name',
        color: 'Color',
        cancel: 'Cancel',
        saveChanges: 'Save Changes',
        progress: 'Progress',
        addHabitsToSeeProgress: 'Add habits to see your progress!',
        allHabitsCombined: 'All Habits Combined',
        less: 'Less',
        more: 'More',
        incomplete: 'Incomplete',
        complete: 'Complete',
        combined: 'Combined',
        separate: 'Separate',
        weekdays: {
            sun: 'Sun',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat',
        },
        footerText: 'Built with ❤️ by Rafał Wiżeń.',
    },
    pl: {
        appTitle: 'Zenith Tracker Nawyków',
        addNewHabit: 'Dodaj Nowy Nawyk',
        habitPlaceholder: 'np. Medytuj przez 10 minut',
        selectColor: 'Wybierz kolor',
        addHabitButton: 'Dodaj Nawyk',
        todaysHabits: 'Dzisiejsze Nawyki',
        noHabitsYet: 'Nie masz jeszcze nawyków. Dodaj jeden, aby zacząć!',
        markAsComplete: 'Oznacz jako wykonane',
        markAsIncomplete: 'Oznacz jako niewykonane',
        editHabit: 'Edytuj nawyk',
        deleteHabit: 'Usuń nawyk',
        editHabitTitle: 'Edytuj Nawyk',
        habitName: 'Nazwa Nawyku',
        color: 'Kolor',
        cancel: 'Anuluj',
        saveChanges: 'Zapisz Zmiany',
        progress: 'Postęp',
        addHabitsToSeeProgress: 'Dodaj nawyki, aby zobaczyć swój postęp!',
        allHabitsCombined: 'Wszystkie Nawyki Razem',
        less: 'Mniej',
        more: 'Więcej',
        incomplete: 'Nieukończone',
        complete: 'Ukończone',
        combined: 'Połączone',
        separate: 'Oddzielnie',
        weekdays: {
            sun: 'Nd',
            mon: 'Pn',
            tue: 'Wt',
            wed: 'Śr',
            thu: 'Cz',
            fri: 'Pt',
            sat: 'Sb',
        },
        footerText: 'Stworzone z ❤️ przez Rafała Wiżenia.',
    },
};