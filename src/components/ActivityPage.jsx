import React from 'react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';
import { Search, Bell, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';

const ActivityPage = () => {
    const { user } = useAuthStore();

    const transactions = [
        { id: 1, type: 'credit', desc: 'Salary Deposit', amount: 85000, date: 'Today, 9:00 AM' },
        { id: 2, type: 'debit', desc: 'Rent Payment', amount: 25000, date: 'Yesterday' },
        { id: 3, type: 'credit', desc: 'Freelance Project', amount: 15000, date: '2 days ago' },
        { id: 4, type: 'debit', desc: 'Electricity Bill', amount: 2500, date: '3 days ago' },
        { id: 5, type: 'debit', desc: 'Grocery Shopping', amount: 4200, date: '4 days ago' },
        { id: 6, type: 'credit', desc: 'Investment Returns', amount: 8500, date: '5 days ago' },
    ];

    return (
        <div className="min-h-screen bg-orange-50/30 text-green-800">
            <Sidebar />
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Activity</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search transactions" className="pl-10 pr-4 py-2 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-green-800 w-64" />
                        </div>
                        <button className="p-2 rounded-xl border border-orange-200 bg-white text-slate-500 hover:text-green-800">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-800 text-white rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={16} />
                            <span className="text-xs uppercase tracking-wide opacity-80">Total Income</span>
                        </div>
                        <p className="text-3xl font-bold">₹1,08,500</p>
                    </div>
                    <div className="bg-white border border-orange-200 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <ArrowDownLeft size={16} className="text-red-500" />
                            <span className="text-xs uppercase tracking-wide text-slate-500">Total Expenses</span>
                        </div>
                        <p className="text-3xl font-bold">₹31,700</p>
                    </div>
                    <div className="bg-white border border-orange-200 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <ArrowUpRight size={16} className="text-green-600" />
                            <span className="text-xs uppercase tracking-wide text-slate-500">Net Savings</span>
                        </div>
                        <p className="text-3xl font-bold text-green-600">₹76,800</p>
                    </div>
                </div>

                <div className="bg-white border border-orange-200 rounded-[32px] p-6 shadow-lg">
                    <h3 className="font-bold mb-6">Recent Transactions</h3>
                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-orange-50/50 rounded-xl hover:bg-orange-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                        {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-medium">{tx.desc}</p>
                                        <p className="text-xs text-slate-500">{tx.date}</p>
                                    </div>
                                </div>
                                <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityPage;
