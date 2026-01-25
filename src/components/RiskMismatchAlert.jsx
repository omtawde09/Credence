import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { mockInvestorProfile, detectRiskMismatch } from '../data/investorProfile';

const RiskMismatchAlert = ({ investor }) => {
    const inv = investor || mockInvestorProfile;
    const mismatch = detectRiskMismatch(inv);

    if (!mismatch) {
        return (
            <div className="bg-teal-50 rounded-[24px] p-4 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp size={16} className="text-teal-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-700">Portfolio Risk Aligned</p>
                    <p className="text-xs text-teal-600">Current risk level matches stated tolerance</p>
                </div>
            </div>
        );
    }

    const severityColors = {
        High: 'bg-red-50 border-red-200',
        Medium: 'bg-amber-50 border-amber-200',
    };

    const severityTextColors = {
        High: 'text-red-700',
        Medium: 'text-amber-700',
    };

    return (
        <div className={`rounded-[24px] p-6 border shadow-sm ${severityColors[mismatch.severity]}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mismatch.severity === 'High' ? 'bg-red-100' : 'bg-amber-100'}`}>
                    <AlertTriangle size={16} className={mismatch.severity === 'High' ? 'text-red-600' : 'text-amber-600'} />
                </div>
                <div>
                    <h3 className={`text-sm font-bold ${severityTextColors[mismatch.severity]}`}>
                        Risk Mismatch Detected
                    </h3>
                    <p className={`text-xs ${mismatch.severity === 'High' ? 'text-red-600' : 'text-amber-600'}`}>
                        {mismatch.severity} Priority Alert
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#CFE3D8] mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Stated Risk</p>
                        <div className="w-16 h-16 rounded-full bg-[#E6EFEA] flex items-center justify-center">
                            <span className="text-xl font-bold text-[#1E3A2F]">{mismatch.statedRisk}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">/10</p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <ArrowRight size={24} className={mismatch.direction === 'Higher' ? 'text-red-500' : 'text-blue-500'} />
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${mismatch.direction === 'Higher' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {mismatch.deviation > 0 ? '+' : ''}{mismatch.deviation}
                        </span>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Actual Risk</p>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${mismatch.direction === 'Higher' ? 'bg-red-100' : 'bg-blue-100'}`}>
                            <span className={`text-xl font-bold ${mismatch.direction === 'Higher' ? 'text-red-600' : 'text-blue-600'}`}>{mismatch.actualRisk}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">/10</p>
                    </div>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                    <div className="absolute h-full w-1 bg-[#1E3A2F]" style={{ left: `${(mismatch.statedRisk / 10) * 100}%` }} />
                    <div 
                        className={`absolute h-full w-1 ${mismatch.direction === 'Higher' ? 'bg-red-500' : 'bg-blue-500'}`} 
                        style={{ left: `${(parseFloat(mismatch.actualRisk) / 10) * 100}%` }} 
                    />
                    <div className="w-full h-full bg-gradient-to-r from-blue-200 via-amber-200 to-red-200 opacity-50" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Conservative</span>
                    <span>Moderate</span>
                    <span>Aggressive</span>
                </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#CFE3D8] mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Explanation</p>
                <p className="text-sm text-gray-700 leading-relaxed">{mismatch.explanation}</p>
            </div>

            <div className="bg-[#E6EFEA] rounded-xl p-4 border border-[#CFE3D8]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#1E3A2F] mb-2">Suggested Action</p>
                <p className="text-sm text-[#1E3A2F] leading-relaxed">{mismatch.suggestedAction}</p>
            </div>

            <button className="w-full mt-4 py-3 bg-[#1E3A2F] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2A4D3F] transition-colors">
                Initiate Rebalancing
            </button>
        </div>
    );
};

export default RiskMismatchAlert;
