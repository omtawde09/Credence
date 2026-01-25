import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, Wallet, PiggyBank, Target, TrendingUp, Plus } from 'lucide-react';

const ManagePage = () => {
    const budgets = [
        { name: 'Food & Dining', spent: 12000, limit: 15000, color: 'bg-slate-1000' },
        { name: 'Transportation', spent: 5000, limit: 8000, color: 'bg-blue-500' },
        { name: 'Entertainment', spent: 3500, limit: 5000, color: 'bg-purple-500' },
        { name: 'Shopping', spent: 8000, limit: 10000, color: 'bg-pink-500' },
    ];

    const goals = [
        { name: 'Emergency Fund', current: 150000, target: 300000, icon: '🛡️' },
        { name: 'Vacation', current: 45000, target: 100000, icon: '✈️' },
        { name: 'New Car', current: 200000, target: 800000, icon: '🚗' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Sidebar />
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Manage</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64" />
                        </div>
                        <button className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <Wallet size={24} className="text-slate-800" />
                                <h3 className="font-bold">Budget Tracker</h3>
                            </div>
                            <button className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:bg-blue-700">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {budgets.map((budget, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">{budget.name}</span>
                                        <span className="text-slate-500">₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${budget.color} rounded-full`} style={{ width: `${(budget.spent / budget.limit) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <Target size={24} className="text-slate-800" />
                                <h3 className="font-bold">Savings Goals</h3>
                            </div>
                            <button className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:bg-blue-700">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {goals.map((goal, i) => (
                                <div key={i} className="p-4 bg-slate-100/50 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{goal.icon}</span>
                                        <div>
                                            <p className="font-medium">{goal.name}</p>
                                            <p className="text-xs text-slate-500">₹{goal.current.toLocaleString()} of ₹{goal.target.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(goal.current / goal.target) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[32px] p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <PiggyBank size={32} />
                            <div>
                                <h3 className="text-xl font-bold">Auto-Save Enabled</h3>
                                <p className="text-slate-300 text-sm">Your AI agent automatically saves 10% of every income</p>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button className="px-6 py-3 bg-white text-slate-800 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">
                                Adjust Settings
                            </button>
                            <button className="px-6 py-3 bg-blue-700 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors">
                                View History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagePage;
