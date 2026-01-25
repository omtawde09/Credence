import React from 'react';
import useAuthStore from '../store/useAuthStore';
import { ForecastChart } from './dashbord/ForcastChart';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import SuperMoneyCard from './SuperMoneyCard';
import SpendingAnalysis from './SpendingAnalysis';

const Dashboard = () => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen text-slate-800">
            <Sidebar />

            {/* Main Content Wrapper - Offset by Sidebar width */}
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Dashboard</h2>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>

                        <button className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-blue-600">
                            <Bell size={18} />
                        </button>

                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* ROW 1: LIVE STATUS CARD */}
                    <div className="md:col-span-3 bg-slate-800 text-white rounded-[32px] p-10 flex flex-col md:flex-row justify-between items-center min-h-[220px] shadow-xl">
                        <div className="flex-1 w-full md:w-auto mb-6 md:mb-0">
                            <div className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 text-[10px] font-bold uppercase tracking-widest rounded-lg mb-4 animate-pulse">
                                Live Status
                            </div>
                            <h1 className="text-4xl font-bold mb-2">
                                Welcome back, <span className="text-teal-300">{user?.displayName || user?.email?.split('@')[0] || "Trader"}</span>
                            </h1>
                            <p className="text-white/70 text-sm max-w-lg">
                                Your autonomous financial agent is monitoring 12 liquidity streams. No immediate risks detected in your cashflow.
                            </p>
                        </div>

                        <div className="flex gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10 w-full md:w-auto justify-between md:justify-start">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Cashflow</span>
                                <span className="text-3xl font-mono font-light">₹1,24,000</span>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Savings</span>
                                <span className="text-3xl font-mono font-light text-teal-300">₹12,400</span>
                            </div>
                        </div>
                    </div>

                    {/* ROW 2: CHART (Left) & SIDE WIDGETS (Right) */}

                    {/* LEFT: CHART */}
                    <div className="md:col-span-2 h-[420px]">
                        <ForecastChart />
                    </div>

                    {/* RIGHT: CARD & SAVINGS */}
                    <div className="md:col-span-1 flex flex-col justify-between h-[420px]">
                        {/* Super Money Card Link */}
                        <Link to="/credit" className="block w-full group relative mb-0 flex-1 flex items-center justify-center overflow-hidden rounded-[32px] bg-transparent">
                            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                {/* Auto-scale the 500px card to fit parent width/height provided */}
                                <div className="transform scale-[0.55] lg:scale-[0.65] xl:scale-[0.7] origin-center">
                                    <SuperMoneyCard name={user?.displayName || "ARJUN SHARMA"} />
                                </div>
                            </div>
                        </Link>

                        {/* Placeholder: Savings Plan */}
                        <div className="bg-white border border-slate-200 rounded-[32px] p-4 h-[180px] flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition-all">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl mb-2">
                                🌱
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Savings Plan Placeholder</span>
                        </div>
                    </div>

                    {/* ROW 3: SPENDING ANALYSIS */}
                    <div className="md:col-span-2">
                        <SpendingAnalysis />
                    </div>

                    {/* ROW 3: RECENT TRANSACTION PLACEHOLDER */}
                    <div className="md:col-span-1 glass-panel rounded-[32px] p-8 min-h-[300px]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <Link to="/investor-onboarding" className="block p-4 bg-blue-50 rounded-2xl border border-blue-200 hover:bg-blue-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">📊</div>
                                    <div>
                                        <div className="font-semibold text-blue-900">Investment Planning</div>
                                        <div className="text-xs text-blue-700">Get personalized recommendations</div>
                                    </div>
                                </div>
                            </Link>
                            
                            <Link to="/advisor-dashboard" className="block p-4 bg-teal-50 rounded-2xl border border-teal-200 hover:bg-teal-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm">👥</div>
                                    <div>
                                        <div className="font-semibold text-teal-900">Advisor Dashboard</div>
                                        <div className="text-xs text-teal-700">View client summaries</div>
                                    </div>
                                </div>
                            </Link>
                            
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white text-sm">🤖</div>
                                    <div>
                                        <div className="font-semibold text-slate-700">AI Agents</div>
                                        <div className="text-xs text-slate-600">Spending & advisor assistance</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
