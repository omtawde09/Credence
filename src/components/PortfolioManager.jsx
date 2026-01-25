import React from 'react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';
import { Target, AlertTriangle, CheckCircle, ArrowRight, Shield } from 'lucide-react';

import PortfolioHealthScore from './PortfolioHealthScore';
import WhatIfSimulator from './WhatIfSimulator';

const PortfolioManager = () => {
    const { user } = useAuthStore();

    // Mock Data for Portfolio Manager
    const portfolioData = {
        totalValue: "₹1.24 Cr",
        allocation: { equity: 65, debt: 25, cash: 10 },
        riskLevel: "Moderate-Aggressive",
        advisor: "Rajesh Kumar",
        activeGoal: {
            name: "Early Retirement",
            progress: 42,
            target: "₹3 Cr",
            current: "₹1.24 Cr",
            timeRemaining: "8 years",
            status: "On Track"
        },
        riskMismatch: {
            detected: true,
            investorProfile: "Moderate",
            currentPortfolio: "Aggressive",
            message: "Your current portfolio risk (Aggressive) is higher than your profile (Moderate). Consider rebalancing to reduce volatility."
        },
        insights: [
            {
                id: 1,
                title: "High Equity Exposure",
                description: "Your equity allocation is 65%, which is slightly above your target of 60%. This increases potential returns but also short-term risk.",
                type: "warning"
            },
            {
                id: 2,
                title: "Cash Drag",
                description: "You have 10% in cash. Consider deploying 5% into short-term debt funds to beat inflation while maintaining liquidity.",
                type: "info"
            }
        ],
        rebalancing: [
            {
                id: 1,
                action: "Reduce Small Cap Equity",
                amount: "5%",
                reason: "To align with your 'Moderate' risk profile.",
                impact: "Lowers expected volatility by ~1.2%."
            },
            {
                id: 2,
                action: "Increase Debt Allocation",
                amount: "5%",
                reason: "Adds stability and consistent income.",
                impact: "Improves portfolio stability score."
            }
        ]
    };

    return (
        <div className="min-h-screen text-slate-800">
            <Sidebar />

            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold dark:text-white">Portfolio Manager</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Holistic view of your financial health</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">Primary Advisor</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{portfolioData.advisor}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg">
                            {portfolioData.advisor.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>
                </header>

                <main className="space-y-6">
                    {/* Top Row: Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Value */}
                        <div className="glass-panel p-6 rounded-[24px]">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100/50 rounded-xl text-blue-600">
                                    <Target size={20} />
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Portfolio Value</h3>
                            </div>
                            <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{portfolioData.totalValue}</p>
                            <div className="mt-4 flex gap-2">
                                <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg flex items-center gap-1">
                                    <Target size={12} /> +12.5%
                                </span>
                                <span className="text-xs text-slate-500 self-center">vs last year</span>
                            </div>
                        </div>

                        {/* Allocation */}
                        <div className="glass-panel p-6 rounded-[24px]">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Allocation</h3>
                            <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex mb-3">
                                <div style={{ width: `${portfolioData.allocation.equity}%` }} className="h-full bg-blue-500" title="Equity" />
                                <div style={{ width: `${portfolioData.allocation.debt}%` }} className="h-full bg-amber-400" title="Debt" />
                                <div style={{ width: `${portfolioData.allocation.cash}%` }} className="h-full bg-slate-400" title="Cash" />
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Equity {portfolioData.allocation.equity}%</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /> Debt {portfolioData.allocation.debt}%</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400" /> Cash {portfolioData.allocation.cash}%</span>
                            </div>
                        </div>

                        {/* Risk Profile */}
                        <div className="glass-panel p-6 rounded-[24px]">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Risk Level</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl font-bold text-slate-800">{portfolioData.riskLevel}</span>
                                <Shield size={24} className={portfolioData.riskMismatch.detected ? "text-amber-500" : "text-green-500"} />
                            </div>
                            {portfolioData.riskMismatch.detected && (
                                <p className="text-xs text-amber-600 font-medium bg-amber-50 px-3 py-2 rounded-xl border border-amber-100 leading-relaxed">
                                    ⚠️ Higher than profile ({portfolioData.riskMismatch.investorProfile})
                                </p>
                            )}
                        </div>
                    </div>

                    {/* NEW ROW: Health & Simulator (Interactive Tools) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PortfolioHealthScore />
                        <WhatIfSimulator />
                    </div>

                    {/* Middle Row: Goals & Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Goal Progress */}
                        <div className="lg:col-span-2 glass-panel p-8 rounded-[32px]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <Target className="text-blue-600" size={20} />
                                        Primary Goal: {portfolioData.activeGoal.name}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Target: {portfolioData.activeGoal.target} • Due in {portfolioData.activeGoal.timeRemaining}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 font-bold text-xs uppercase tracking-widest rounded-full">
                                    {portfolioData.activeGoal.status}
                                </span>
                            </div>

                            <div className="mb-2 flex justify-between text-sm font-bold">
                                <span>{portfolioData.activeGoal.current}</span>
                                <span>{portfolioData.activeGoal.target}</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${portfolioData.activeGoal.progress}%` }} />
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                You are consistently meeting your monthly contribution targets. At this rate, you are projected to reach your goal 3 months early.
                            </p>
                        </div>

                        {/* Insights Panel */}
                        <div className="glass-panel p-6 rounded-[32px] bg-white/40">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Manager Insights</h3>
                            <div className="space-y-4">
                                {portfolioData.insights.map(insight => (
                                    <div key={insight.id} className="bg-white/50 border border-white/60 p-4 rounded-xl backdrop-blur-sm">
                                        <h4 className={`text-sm font-bold mb-1 flex items-center gap-2 ${insight.type === 'warning' ? 'text-amber-600' : 'text-blue-600'}`}>
                                            {insight.type === 'warning' && <AlertTriangle size={14} />}
                                            {insight.title}
                                        </h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {insight.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Advisory Suggestions */}
                    <div className="glass-panel p-8 rounded-[32px] border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Rebalancing Suggestions</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Advisory Only • Non-Binding</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {portfolioData.rebalancing.map(item => (
                                <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-200/50 hover:bg-white/60 transition-colors">
                                    <div className="mt-1">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">
                                            {item.id}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                            {item.action}
                                            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{item.amount}</span>
                                        </h4>
                                        <p className="text-xs text-slate-600 mt-1 mb-2 leading-relaxed">{item.reason}</p>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                                            Impact: {item.impact}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PortfolioManager;
