import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp, TrendingDown, Target, Clock, Shield, Sparkles } from 'lucide-react';
import { applyAgentConstraints, assessRiskThreshold, representUncertainty, shouldAgentAct } from '../utils/kiroIntegration';
import { GoogleGenerativeAI } from "@google/generative-ai";

const InvestmentExplainer = ({ recommendation, investorProfile }) => {
    const [showRisks, setShowRisks] = useState(false);
    const [aiExplanation, setAiExplanation] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [useAI, setUseAI] = useState(false);

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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

    // Apply .kiro reasoning to the recommendation
    const kiroValidation = applyAgentConstraints({
        description: `${rec.name} with expected returns of ${rec.expectedReturn}`,
        type: 'recommendation',
        confidence: 0.75
    }, profile);

    // Assess risk using .kiro thresholds
    const riskAssessment = assessRiskThreshold(
        profile.riskProfile.maxDrawdownTolerance, // Using drawdown tolerance as risk probability
        profile.riskProfile.score * 10 // Converting score to impact severity
    );

    // Apply uncertainty representation
    const returnUncertainty = representUncertainty(11, 0.65); // 11% expected return with 65% confidence

    // Check if agent should provide this recommendation
    const agentDecision = shouldAgentAct(
        { complexity: 0.6, impact: 0.8, probability: 0.7 },
        { demonstratedSuccess: false, handledComplexity: 0.3 },
        0.75 // Information quality
    );

    // Generate AI-powered explanation
    const generateAIExplanation = async () => {
        setLoadingAI(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Generate a clear, professional explanation for why this investment recommendation is suitable:

Investor Profile:
- Age: ${profile.age}, Goals: ${profile.goals.map(g => g.name).join(', ')}
- Risk Tolerance: ${profile.riskProfile.stated} (${profile.riskProfile.score}/10)
- Max Drawdown Tolerance: ${profile.riskProfile.maxDrawdownTolerance}%
- Investment Experience: ${profile.riskProfile.investmentExperience}
- Preferences: ${profile.preferences.assetClasses.join(', ')}

Recommendation:
- Portfolio: ${rec.name}
- Allocation: ${rec.allocation.equity}% equity, ${rec.allocation.debt}% debt, ${rec.allocation.gold}% gold, ${rec.allocation.cash}% cash
- Expected Return: ${rec.expectedReturn}
- Risk Level: ${rec.riskLevel}

Generate a suitability explanation covering:
1. How this aligns with investor goals and timeline
2. Why the risk level matches their tolerance
3. How the allocation supports their objectives

Keep it professional, clear, and under 150 words. Use Indian financial terminology.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            setAiExplanation(text.trim());
            setUseAI(true);
        } catch (error) {
            console.error("AI Explanation generation error:", error);
            setUseAI(false);
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <div className="bg-white rounded-[24px] p-6 border border-[#CFE3D8] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#E6EFEA] rounded-full flex items-center justify-center">
                    <Target size={16} className="text-[#1E3A2F]" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Recommendation Rationale</h3>
                <button
                    onClick={generateAIExplanation}
                    disabled={loadingAI}
                    className="ml-auto flex items-center gap-1 px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold rounded-full transition-colors"
                >
                    {loadingAI ? (
                        <Sparkles size={12} className="animate-spin" />
                    ) : (
                        <Sparkles size={12} />
                    )}
                    {useAI ? 'AI' : 'AI+'}
                </button>
                {!agentDecision.shouldAct && (
                    <div className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        Limited Confidence
                    </div>
                )}
            </div>

            {/* .kiro Validation Warnings */}
            {kiroValidation.violations.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={14} className="text-red-600" />
                        <span className="text-xs font-bold text-red-800">Agent Constraint Violations</span>
                    </div>
                    {kiroValidation.violations.map((violation, idx) => (
                        <p key={idx} className="text-xs text-red-700">{violation}</p>
                    ))}
                </div>
            )}

            {/* Risk Assessment from .kiro */}
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">Risk Assessment</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        riskAssessment.color === 'green' ? 'bg-green-100 text-green-800' :
                        riskAssessment.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {riskAssessment.band} Risk
                    </span>
                </div>
                <p className="text-xs text-gray-600">
                    Action: {riskAssessment.action} | Confidence: {riskAssessment.confidence}
                </p>
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
                            <span className="font-bold text-[#1E3A2F] block mb-1">Expected Returns (.kiro Validated)</span>
                            <p>Expected return range: {returnUncertainty.range.display}% annually (Confidence: {returnUncertainty.confidenceLevel})</p>
                            {returnUncertainty.disclaimer && (
                                <p className="text-xs text-amber-700 mt-1 font-medium">{returnUncertainty.disclaimer}</p>
                            )}
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
                    {useAI && aiExplanation ? (
                        <div className="relative">
                            <div className="absolute top-0 right-0">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                    <Sparkles size={10} />
                                    AI
                                </span>
                            </div>
                            <p className="pr-12">{aiExplanation}</p>
                        </div>
                    ) : (
                        <p>Based on the stated financial goals, risk tolerance, investment horizon, and preference for {profile.preferences.prefersSRI ? 'socially responsible investing' : 'diversified portfolios'}, this allocation is considered suitable. The {rec.allocation.equity}% equity exposure provides growth potential while {rec.allocation.debt}% debt allocation offers stability and regular income.</p>
                    )}
                    
                    {!agentDecision.shouldAct && (
                        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-800 font-medium">
                                <strong>Agent Note:</strong> {agentDecision.reason} 
                                Recommended action: {agentDecision.alternativeAction}
                            </p>
                        </div>
                    )}
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

                    <div className="p-4 bg-teal-50 rounded-xl border border-slate-100">
                        <div className="flex items-start gap-3">
                            <TrendingUp size={16} className="text-teal-600 mt-0.5 shrink-0" />
                            <div>
                                <span className="font-bold text-slate-700 block mb-1">Best-Case Scenario</span>
                                <p className="text-sm text-slate-700/80">Under favorable market conditions with sustained economic growth, this portfolio could generate 12-15% annualized returns over the investment horizon. This would result in achieving goals ahead of schedule and potentially allow for lifestyle upgrades or early retirement considerations.</p>
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
