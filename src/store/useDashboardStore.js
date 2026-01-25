import { create } from 'zustand';

const useDashboardStore = create((set) => ({
    dashboardData: {
        cashflow: 0,
        savings: 0,
        liveStatusMessage: "System initializing...",

        recentTransactions: [], // Empty default

        chartData: {
            "7D": [],
            "30D": [],
            "90D": []
        }
    },
    isLoading: false,

    fetchDashboardData: async () => {
        set({ isLoading: true });
        // Future Supabase call
        setTimeout(() => set({ isLoading: false }), 500);
    }
}));

export default useDashboardStore;
