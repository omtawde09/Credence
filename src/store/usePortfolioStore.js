import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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
        rebalancing: [],
        sips: [] // New SIP list
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
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                set({ isLoading: false });
                return;
            }

            // Fetch Portfolio
            const { data: portfolio, error: pError } = await supabase
                .from('portfolios')
                .select('*')
                .eq('user_id', user.id)
                .single();

            // Fetch Health Data
            const { data: health, error: hError } = await supabase
                .from('health_scores')
                .select('*')
                .eq('user_id', user.id)
                .single();

            // Fetch Goals
            const { data: goals, error: gError } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'On Track')
                .limit(1)
                .single();

            // Fetch SIPs
            const { data: sips, error: sError } = await supabase
                .from('sips')
                .select('*')
                .eq('user_id', user.id);

            if (portfolio) {
                // Enterprise Risk Logic: Check Drift
                let driftDetected = false;
                let profile = portfolio.risk_level || "Moderate";
                let equity = portfolio.equity_allocation || 0;

                // Rule: If Conservative but Equity > 40%, Drift!
                if (profile === "Conservative" && equity > 40) driftDetected = true;
                // Rule: If Moderate but Equity > 75%, Drift!
                if (profile === "Moderate" && equity > 75) driftDetected = true;

                set(state => ({
                    portfolioData: {
                        ...state.portfolioData,
                        totalValue: `₹${(portfolio.total_value / 10000000).toFixed(2)} Cr`,
                        rawValue: portfolio.total_value,
                        allocation: {
                            equity: portfolio.equity_allocation,
                            debt: portfolio.debt_allocation,
                            cash: portfolio.cash_allocation
                        },
                        riskLevel: portfolio.risk_level || "Unknown",
                        advisor: portfolio.advisor_name || "Unassigned",
                        manager: portfolio.manager_name || "Unassigned",
                        // Inject SIPs
                        sips: sips || [],
                        riskMismatch: {
                            detected: driftDetected,
                            investorProfile: profile,
                            currentPortfolio: driftDetected ? "Drifting" : "Aligned",
                            message: driftDetected
                                ? "CRITICAL: Equity allocation exceeds risk limits. Advisor review mandatory."
                                : "Portfolio is aligned with risk profile."
                        },
                        activeGoal: goals ? {
                            name: goals.name,
                            progress: (goals.current_amount / goals.target_amount) * 100,
                            target: `₹${(goals.target_amount / 10000000).toFixed(2)} Cr`,
                            current: `₹${(goals.current_amount / 10000000).toFixed(2)} Cr`,
                            timeRemaining: "Calculated...",
                            status: goals.status
                        } : state.portfolioData.activeGoal
                    }
                }));
            }

            if (health) {
                set(state => ({
                    healthData: {
                        score: health.overall_score,
                        status: health.overall_score > 70 ? "Good" : "Fair",
                        metrics: [
                            { name: "Diversification", score: health.diversification_score, status: "Check" },
                            { name: "Risk Alignment", score: health.risk_score, status: "Check" },
                            { name: "Goal Fit", score: health.goal_score, status: "Check" }
                        ]
                    }
                }));
            }

        } catch (error) {
            console.error("Supabase fetch error:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateGoal: (newGoalData) => set((state) => ({
        portfolioData: { ...state.portfolioData, activeGoal: { ...state.portfolioData.activeGoal, ...newGoalData } }
    })),

    // SIP Actions
    toggleSIP: async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';

        // Optimistic Update
        set(state => ({
            portfolioData: {
                ...state.portfolioData,
                sips: state.portfolioData.sips.map(s => s.id === id ? { ...s, status: newStatus } : s)
            }
        }));

        const { error } = await supabase.from('sips').update({ status: newStatus }).eq('id', id);
        if (error) {
            console.error("SIP toggle failed", error);
            // Revert on error would go here
        }
    }
}));

export default usePortfolioStore;
