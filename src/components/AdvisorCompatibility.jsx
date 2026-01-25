import React from 'react';
import { Users, Check, Info } from 'lucide-react';
import { mockInvestorProfile, mockAdvisorProfile, calculateCompatibilityScore } from '../data/investorProfile';

const AdvisorCompatibility = ({ investor, advisor }) => {
    const inv = investor || mockInvestorProfile;
    const adv = advisor || mockAdvisorProfile;
    const { score, factors } = calculateCompatibilityScore(inv, adv);

    const getScoreColor = (s) => {
        if (s >= 80) return 'text-teal-600 bg-teal-50 border-slate-200';
        if (s >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getScoreLabel = (s) => {
        if (s >= 80) return 'Strong Match';
        if (s >= 60) return 'Good Match';
        return 'Review Recommended';
    };

    return (
        <div className="bg-white rounded-[24px] p-6 border border-[#CFE3D8] shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#E6EFEA] rounded-full flex items-center justify-center">
                        <Users size={16} className="text-[#1E3A2F]" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Advisor Compatibility</h3>
                </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1E3A2F] flex items-center justify-center text-white font-bold text-lg">
                        {inv.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-bold text-[#1E3A2F]">{inv.name}</p>
                        <p className="text-xs text-gray-500">Investor</p>
                    </div>
                </div>

                <div className="flex-1 border-t-2 border-dashed border-[#CFE3D8] relative">
                    <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full border-2 ${getScoreColor(score)} font-bold text-lg`}>
                        {score}%
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div>
                        <p className="font-bold text-[#1E3A2F] text-right">{adv.name}</p>
                        <p className="text-xs text-gray-500 text-right">{adv.designation}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-[#1E3A2F] font-bold text-lg">
                        {adv.name.split(' ').map(n => n[0]).join('')}
                    </div>
                </div>
            </div>

            <div className={`text-center py-2 px-4 rounded-xl mb-6 ${getScoreColor(score)}`}>
                <span className="text-sm font-bold">{getScoreLabel(score)}</span>
            </div>

            <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Contributing Factors</p>
                {factors.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#FAFAF7] rounded-xl border border-[#CFE3D8]/50">
                        <div className="w-6 h-6 rounded-full bg-[#E6EFEA] flex items-center justify-center shrink-0">
                            <Check size={12} className="text-[#1E3A2F]" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-bold text-[#1E3A2F]">{f.factor}</span>
                                <span className="text-xs font-bold text-emerald-600">+{f.contribution}%</span>
                            </div>
                            <p className="text-xs text-gray-500">{f.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2">
                <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">This score is calculated based on alignment of risk philosophy, goal-expertise match, advisor experience, and investment style compatibility.</p>
            </div>
        </div>
    );
};

export default AdvisorCompatibility;
