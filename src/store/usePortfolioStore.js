import { create } from 'zustand';

const usePortfolioStore = create((set) => ({
    portfolioData: {
        totalValue: "₹0",
        rawValue: 0,
        allocation: { equity: 0, debt: 0, cash: 0 },
        riskLevel: "Unknown",
        advisor: "Not Assigned",
        manager: "Not Assigned",
        activeGoal: {
            name: "No Active Goal",
            progress: 0,
            target: "₹0",
            current: "₹0",
            timeRemaining: "-",
            status: "Pending"
        },
        riskMismatch: {
            detected: false,
            investorProfile: "Unknown",
            currentPortfolio: "Unknown",
            message: ""
        },
        insights: [],
        rebalancing: []
    },
    healthData: {
        score: 0,
        status: "Pending",
        metrics: []
    },
    isLoading: false,
    error: null,

    // Actions
    fetchPortfolioData: async () => {
        set({ isLoading: true });
        // Simulate API call
        // In the future: const { data } = await supabase.from('portfolio').select('*');
        setTimeout(() => {
            set({ isLoading: false });
        }, 500);
    },

    updateGoal: (newGoalData) => set((state) => ({
        portfolioData: { ...state.portfolioData, activeGoal: { ...state.portfolioData.activeGoal, ...newGoalData } }
    }))
}));

export default usePortfolioStore;
