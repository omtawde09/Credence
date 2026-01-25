import React, { useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw, Info } from 'lucide-react';
import usePortfolioStore from '../store/usePortfolioStore';

const WhatIfSimulator = () => {
    const [scenario, setScenario] = useState(0); // 0 = baseline

    const { portfolioData } = usePortfolioStore();
    // Use rawValue from store, fallback if missing
    const baseValue = portfolioData?.rawValue || 12400000;
    const baseDate = "Dec 2032";

    const scenarios = [
        { label: "Market Correction", value: -10, desc: "A standard market correction." },
        { label: "Bear Market", value: -20, desc: "A significant market downturn." },
        { label: "Baseline", value: 0, desc: "Current market conditions." },
        { label: "Bull Run", value: 10, desc: "Optimistic market growth." },
    ];

    const calculateImpact = (percent) => {
        const newValue = baseValue * (1 + percent / 100);
        // Simple logic: -10% drop might delay goal by ~1 year
        let delayMsg = "On Track";
        if (percent === -10) delayMsg = "Delayed by ~1.5 Years";
        if (percent === -20) delayMsg = "Delayed by ~3 Years";
        if (percent === 10) delayMsg = "Accelerated by ~1 Year";

        return {
            newValue: (newValue / 10000000).toFixed(2) + " Cr",
            impact: delayMsg,
            diff: newValue - baseValue
        };
    };

    const currentImpact = calculateImpact(scenario);

    return (
        <div className="glass-panel p-6 rounded-[24px]">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                    <RefreshCcw size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">What-If Simulator</h3>
                    <p className="text-xs text-slate-400">Simulate market conditions on your goal</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {scenarios.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => setScenario(s.value)}
                            className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${scenario === s.value
                                ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                }`}
                        >
                            {s.value > 0 ? '+' : ''}{s.value}%
                        </button>
                    ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Projected Value</span>
                        <div className="text-right">
                            <span className={`text-2xl font-black ${scenario > 0 ? 'text-green-500' : scenario < 0 ? 'text-red-500' : 'text-slate-800 dark:text-white'
                                }`}>
                                {currentImpact.newValue}
                            </span>
                            {scenario !== 0 && (
                                <p className="text-[10px] font-bold text-slate-400">
                                    {scenario > 0 ? '+' : ''}{(currentImpact.diff / 100000).toFixed(1)} Lakhs
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Goal Timeline</span>
                        <span className={`text-sm font-bold ${scenario < 0 ? 'text-amber-500' : 'text-slate-800 dark:text-white'
                            }`}>
                            {currentImpact.impact}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-xl">
                    <Info size={16} className="shrink-0" />
                    <p className="leading-relaxed">
                        {scenario === 0
                            ? "Current market conditions are stable. Stick to your plan for best results."
                            : scenario < 0
                                ? "Market corrections are temporary. History suggests staying invested yields better long-term results than selling."
                                : "Accelerated growth is great, but ensure you rebalance to avoid over-exposure to risky assets."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WhatIfSimulator;
