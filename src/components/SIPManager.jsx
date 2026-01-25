import React, { useState } from 'react';
import usePortfolioStore from '../store/usePortfolioStore';
import { Play, Pause, Calculator, TrendingUp, AlertCircle } from 'lucide-react';

const SIPManager = () => {
    const { portfolioData, toggleSIP } = usePortfolioStore();
    const { sips } = portfolioData;
    const [view, setView] = useState('list'); // 'list' | 'calculator'

    // Calculator State
    const [calcAmount, setCalcAmount] = useState(10000);
    const [calcYears, setCalcYears] = useState(10);
    const [calcRate, setCalcRate] = useState(12);

    const calculateReturns = () => {
        const months = calcYears * 12;
        const rate = calcRate / 12 / 100;
        const maturity = calcAmount * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
        const invested = calcAmount * months;
        return { invested, maturity, gain: maturity - invested };
    };

    const result = calculateReturns();

    return (
        <div className="glass-panel p-6 rounded-[24px] relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" size={20} />
                        SIP Manager
                    </h3>
                    <p className="text-xs text-slate-500">Automated Discipline</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    <button
                        onClick={() => setView('list')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${view === 'list' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setView('calculator')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${view === 'calculator' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
                    >
                        Calculator
                    </button>
                </div>
            </div>

            {view === 'list' ? (
                <div className="space-y-4">
                    {sips.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">
                            No Active SIPs. <br /> Advisor can initiate new mandates.
                        </div>
                    ) : (
                        sips.map(sip => (
                            <div key={sip.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl">
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{sip.asset_name}</h4>
                                    <p className="text-xs text-slate-500">{sip.frequency} • Next: {sip.next_date || 'TBD'}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">₹{sip.amount.toLocaleString('en-IN')}</span>
                                    <button
                                        onClick={() => toggleSIP(sip.id, sip.status)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${sip.status === 'Active' ? 'bg-emerald-100 text-emerald-600 hover:bg-amber-100 hover:text-amber-600' : 'bg-slate-200 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600'}`}
                                        title={sip.status === 'Active' ? 'Pause SIP' : 'Resume SIP'}
                                    >
                                        {sip.status === 'Active' ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <label className="col-span-3 font-bold text-slate-500">Monthly Investment</label>
                        <input type="range" min="1000" max="100000" step="500" value={calcAmount} onChange={e => setCalcAmount(Number(e.target.value))} className="col-span-2 accent-emerald-500" />
                        <span className="text-right font-mono">₹{calcAmount}</span>

                        <label className="col-span-3 font-bold text-slate-500 mt-2">Time Period (Years)</label>
                        <input type="range" min="1" max="30" value={calcYears} onChange={e => setCalcYears(Number(e.target.value))} className="col-span-2 accent-blue-500" />
                        <span className="text-right font-mono">{calcYears} Y</span>

                        <label className="col-span-3 font-bold text-slate-500 mt-2">Expected Return (%)</label>
                        <input type="range" min="4" max="24" value={calcRate} onChange={e => setCalcRate(Number(e.target.value))} className="col-span-2 accent-purple-500" />
                        <span className="text-right font-mono">{calcRate}%</span>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 text-center mt-4">
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Projected Wealth</p>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">₹{Math.round(result.maturity).toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-emerald-600 mt-1">
                            Invested: ₹{Math.round(result.invested).toLocaleString('en-IN')} • Gain: ₹{Math.round(result.gain).toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="flex items-start gap-2 text-[10px] text-slate-400 mt-2">
                        <AlertCircle size={12} className="mt-0.5" />
                        Illustrative only. Not a guarantee of future returns.
                    </div>
                </div>
            )}
        </div>
    );
};

export default SIPManager;
