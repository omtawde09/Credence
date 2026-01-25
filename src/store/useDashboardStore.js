import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                set({ isLoading: false });
                return;
            }

            // Fetch Transactions (Last 5)
            const { data: txs, error: txError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .limit(5);

            if (txs) {
                const formattedTxs = txs.map(t => ({
                    id: t.id,
                    name: t.name,
                    date: new Date(t.date).toLocaleDateString(),
                    amount: `₹${t.amount}`,
                    type: t.type
                }));
                set(state => ({ dashboardData: { ...state.dashboardData, recentTransactions: formattedTxs } }));
            }

            // Fetch Cashflow (from Portfolio or aggregated transactions)
            const { data: portfolio } = await supabase
                .from('portfolios')
                .select('cashflow, savings')
                .eq('user_id', user.id)
                .single();

            if (portfolio) {
                set(state => ({
                    dashboardData: {
                        ...state.dashboardData,
                        cashflow: portfolio.cashflow,
                        savings: portfolio.savings
                    }
                }));
            }

        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useDashboardStore;
