import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp, TrendingDown, Target, Clock, Shield } from 'lucide-react';

const InvestmentExplainer = ({ recommendation, investorProfile }) => {
    const [showRisks, setShowRisks] = useState(false);

    const profile = investorProfile || {
        goals: [{ name: 'Retirement Corpus', horizon: '25 years' }, { name: 'Child Education', horizon: '15 years' }],
        riskProfile: { stated: 'Moderate', score: 6, maxDrawdownTolerance: 15 },
        preferences: { assetClasses: ['Equity Mutual Funds', 'Index Funds'], prefersSRI: true },
        age: 35,
    };

    const rec = recommendation || {
        name: 'Balanced Growth Portfolio',
        allocation: { equity: 60, debt: 30, gold: 5, cash: 5 },
        expectedReturn: '10-12%',
        riskLevel: 'Moderate',
    };

    return (
        <div className="bg-white rounded-[24px] p-6 border border-[#CFE3D8] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#E6EFEA] rounded-full flex items-center justify-center">
                    <Target size={16} className="text-[#1E3A2F]" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Recommendation Rationale</h3>
            </div>

            <div className="space-y-4 text-sm text-[#1E3A2F]/80 leading-relaxed">
                <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#CFE3D8]/50">
                    <div className="flex items-start gap-3 mb-3">
                        <Target size={16} className="text-[#1E3A2F] mt-0.5 shrink-0" />
                        <div>
                            <span className="font-bold text-[#1E3A2F] block mb-1">Investor Goals</span>
                            <p>Primary objectives are {profile.goals[0].name} ({profile.goals[0].horizon}) and {profile.goals[1].name} ({profile.goals[1].horizon}). The long investment horizon supports a growth-oriented approach.</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#CFE3D8]/50">
                    <div className="flex items-start gap-3 mb-3">
                        <Clock size={16} className="text-[#1E3A2F] mt-0.5 shrink-0" />
                        <div>
                            <span className="font-bold text-[#1E3A2F] block mb-1">Time Horizon</span>
                            <p>With 15-25 years until key goals, there is sufficient time to recover from market downturns. This allows for higher equity exposure while maintaining long-term stability.</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#CFE3D8]/50">
                    <div className="flex items-start gap-3 mb-3">
                        <Shield size={16} className="text-[#1E3A2F] mt-0.5 shrink-0" />
                        <div>
                            <span className="font-bold text-[#1E3A2F] block mb-1">Risk Tolerance</span>
                            <p>Stated risk tolerance is {profile.riskProfile.stated} ({profile.riskProfile.score}/10) with a maximum acceptable drawdown of {profile.riskProfile.maxDrawdownTolerance}%. The recommended portfolio is calibrated to stay within these parameters under normal market conditions.</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[#E6EFEA] rounded-xl border border-[#CFE3D8]">
                    <span className="font-bold text-[#1E3A2F] block mb-2">Suitability Statement</span>
                    <p>Based on the stated financial goals, risk tolerance, investment horizon, and preference for {profile.preferences.prefersSRI ? 'socially responsible investing' : 'diversified portfolios'}, this allocation is considered suitable. The {rec.allocation.equity}% equity exposure provides growth potential while {rec.allocation.debt}% debt allocation offers stability and regular income.</p>
                </div>
            </div>

            <button 
                onClick={() => setShowRisks(!showRisks)}
                className="w-full mt-4 py-3 px-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between hover:bg-amber-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-600" />
                    <span className="text-sm font-bold text-amber-800">What could go wrong?</span>
                </div>
                {showRisks ? <ChevronUp size={16} className="text-amber-600" /> : <ChevronDown size={16} className="text-amber-600" />}
            </button>

            {showRisks && (
                <div className="mt-4 space-y-4 animate-fade-in">
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <div className="flex items-start gap-3">
                            <TrendingDown size={16} className="text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <span className="font-bold text-red-700 block mb-1">Worst-Case Scenario</span>
                                <p className="text-sm text-red-700/80">In a severe market downturn (similar to 2008 or 2020), this portfolio could temporarily decline by 20-30%. Recovery may take 18-36 months. During this period, it is critical to stay invested and avoid panic selling. Historical data suggests that long-term investors who remained invested recovered fully.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="flex items-start gap-3">
                            <TrendingUp size={16} className="text-green-600 mt-0.5 shrink-0" />
                            <div>
                                <span className="font-bold text-green-700 block mb-1">Best-Case Scenario</span>
                                <p className="text-sm text-green-700/80">Under favorable market conditions with sustained economic growth, this portfolio could generate 12-15% annualized returns over the investment horizon. This would result in achieving goals ahead of schedule and potentially allow for lifestyle upgrades or early retirement considerations.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="font-bold text-gray-700 block mb-1">Key Risk Factors</span>
                        <ul className="text-sm text-gray-600 space-y-1 mt-2">
                            <li>• Market volatility affecting equity portion</li>
                            <li>• Interest rate changes impacting debt returns</li>
                            <li>• Inflation eroding purchasing power over time</li>
                            <li>• Currency fluctuations for international exposure</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentExplainer;
