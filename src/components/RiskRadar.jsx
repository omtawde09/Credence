import React from 'react';
import usePortfolioStore from '../store/usePortfolioStore';
import { ShieldAlert, ShieldCheck, RefreshCw } from 'lucide-react';

const RiskRadar = () => {
    const { portfolioData } = usePortfolioStore();
    const { riskMismatch, riskLevel } = portfolioData;

    return (
        <div className={`glass-panel p-6 rounded-[24px] ${riskMismatch.detected ? 'border-2 border-amber-400 bg-amber-50/50 dark:bg-amber-900/10' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {riskMismatch.detected ? <ShieldAlert className="text-amber-500" /> : <ShieldCheck className="text-green-500" />}
                        Risk Radar
                    </h3>
                    <p className="text-xs text-slate-500">Continuous Suitability Check</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Target Profile</span>
                    <span className="font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300">{riskMismatch.investorProfile || "Unknown"}</span>
                </div>

                <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700" />

                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Actual Exposure</span>
                    <span className={`font-bold px-2 py-1 rounded ${riskMismatch.detected ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {riskLevel}
                    </span>
                </div>

                {riskMismatch.detected && (
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-900 shadow-sm mt-2">
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-500 mb-1">DRIFT DETECTED</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            {riskMismatch.message}
                        </p>
                        <button className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <RefreshCw size={12} />
                            Request Rebalancing
                        </button>
                    </div>
                )}

                {!riskMismatch.detected && (
                    <div className="text-xs text-center text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-900">
                        Portfolio is strictly aligned with client mandate.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskRadar;
