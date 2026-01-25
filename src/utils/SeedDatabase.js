import { supabase } from '../lib/supabase';

export const seedDatabase = async (userId) => {
    if (!userId) return { success: false, error: "No user logged in" };

    try {
        console.log("Seeding started for:", userId);

        // 1. Update Profile (Role)
        await supabase.from('profiles').update({ role: 'investor' }).eq('id', userId);

        // 2. Insert Portfolio
        // Check if exists first
        const { data: existingPort } = await supabase.from('portfolios').select('id').eq('user_id', userId).single();

        if (existingPort) {
            await supabase.from('portfolios').update({
                total_value: 12400000,
                cashflow: 124000,
                savings: 12400,
                equity_allocation: 65,
                debt_allocation: 25,
                cash_allocation: 10,
                risk_level: "Moderate-Aggressive",
                advisor_name: "Rajesh Kumar",
                manager_name: "Sarah Sterling"
            }).eq('user_id', userId);
        }

        // 3. Insert Goal
        const { data: existingGoal } = await supabase.from('goals').select('id').eq('user_id', userId).eq('name', 'Early Retirement').single();
        if (!existingGoal) {
            await supabase.from('goals').insert({
                user_id: userId,
                name: "Early Retirement",
                target_amount: 30000000,
                current_amount: 12400000,
                deadline: "2032-12-31",
                status: "On Track"
            });
        }

        // 4. Insert Health Score
        await supabase.from('health_scores').update({
            overall_score: 78,
            diversification_score: 85,
            risk_score: 60,
            goal_score: 90
        }).eq('user_id', userId);

        // 5. Insert Transactions
        const { count } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('user_id', userId);
        if (count === 0) {
            await supabase.from('transactions').insert([
                { user_id: userId, name: "SIP Investment", amount: 15000, type: "debit", date: new Date().toISOString() },
                { user_id: userId, name: "Dividend Payout", amount: 2400, type: "credit", date: new Date(Date.now() - 86400000).toISOString() },
                { user_id: userId, name: "Utility Bill", amount: 3200, type: "debit", date: new Date(Date.now() - 172800000).toISOString() }
            ]);
        }

        // 6. Insert SIPs (New)
        const { count: sipCount } = await supabase.from('sips').select('*', { count: 'exact', head: true }).eq('user_id', userId);
        if (sipCount === 0) {
            await supabase.from('sips').insert([
                { user_id: userId, asset_name: "HDFC Top 100 Eq", amount: 5000, frequency: "Monthly", status: "Active", next_date: "2026-02-05" },
                { user_id: userId, asset_name: "SBI Bluechip", amount: 10000, frequency: "Monthly", status: "Active", next_date: "2026-02-10" },
                { user_id: userId, asset_name: "Gold Bees", amount: 2000, frequency: "Quarterly", status: "Paused", next_date: "2026-04-01" }
            ]);
        }

        console.log("Seeding complete!");
        window.location.reload(); // Refresh to see data
        return { success: true };

    } catch (error) {
        console.error("Seeding failed:", error);
        return { success: false, error: error.message };
    }
};
