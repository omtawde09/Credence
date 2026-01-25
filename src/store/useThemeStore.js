import { create } from 'zustand';

const useThemeStore = create((set, get) => ({
    isDarkMode: false,

    toggleTheme: () => {
        const newMode = !get().isDarkMode;
        set({ isDarkMode: newMode });
        localStorage.setItem('credence_theme', newMode ? 'dark' : 'light');

        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    initializeTheme: () => {
        const savedTheme = localStorage.getItem('credence_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let isDark = false;

        if (savedTheme) {
            isDark = savedTheme === 'dark';
        } else {
            isDark = systemPrefersDark;
        }

        set({ isDarkMode: isDark });

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}));

export default useThemeStore;
