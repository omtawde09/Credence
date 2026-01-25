import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ArrowLeft, Check, ChevronDown, ChevronUp, AlertTriangle, Shield, TrendingUp, Users, Info } from 'lucide-react';
import { validateRecommendationWithKiroConstraints } from '../data/investorProfile';

const InvestorRecommendations = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const profile = location.state?.profile;
    const [expandedRec, setExpandedRec] = useState(null);
    const [showAssumptions, setShowAssumptions] = useState(false);
    const [validatedRecommendations, setValidatedRecommendations] = useState([]);
    const [aiEnhancementStatus, setAiEnhancementStatus] = useState({ enabled: false });

    // Initialize AI assistance and validate recommendations
    useEffect(() => {
        const initializeRecommendations = async () => {
            // Check AI assistance status
            try {
                const { getAIAssistStatus } = await import('../utils/aiAssistLayer.js');
                setAiEnhancementStatus(getAIAssistStatus());
            } catch (error) {
                console.warn('AI assistance layer not available:', error);
            }

            // Apply .kiro validation to all recommendations
            const validatedRecs = await Promise.all(
                recommendations.map(async (rec) => {
                    const kiroValidation = await validateRecommendationWithKiroConstraints(rec, profile);
                    return {
                        ...rec,
                        kiroValidation
                    };
                })
            );

            setValidatedRecommendations(validatedRecs);
        };

        initializeRecommendations();
    }, [profile]);

    const goalLabels = {
        retirement: 'Retirement Planning',
        wealth: 'Wealth Creation',
        home: 'Home Purchase',
        education: 'Child Education',
        emergency: 'Emergency Fund',
        travel: 'Travel & Experiences'
    };

    const riskLabels = {
        conservative: { label: 'Conservative', equity: '20-30%', score: 3 },
        moderate: { label: 'Moderate', equity: '40-60%', score: 5 },
        growth: { label: 'Growth', equity: '60-80%', score: 7 },
        aggressive: { label: 'Aggressive', equity: '80-100%', score: 9 }
    };

    const horizonLabels = {
        short: '1-3 Years',
        medium: '3-7 Years',
        long: '7-15 Years',
        verylong: '15+ Years'
    };

    // Apply .kiro validation to all recommendations
    const recommendations = [
        {
            id: 1,
            name: 'Diversified Growth Portfolio',
            type: 'Recommended for you',
            suitability: 95,
            allocation: {
                'Large Cap Equity': 35,
                'Mid Cap Equity': 15,
                'International Equity': 10,
                'Debt Funds': 30,
                'Gold ETF': 10
            },
            expectedReturn: '10-12% p.a.',
            risk: 'Moderate',
            reasoning: [
                `Aligned with your ${riskLabels[profile?.riskScenario]?.label || 'moderate'} risk profile`,
                `Suitable for your ${horizonLabels[profile?.timeHorizon] || 'medium-term'} time horizon`,
                `Designed to meet your ${goalLabels[profile?.primaryGoal] || 'financial'} goal`,
                profile?.preferences?.prefersSRI ? 'Includes ESG-focused funds' : 'Optimized for risk-adjusted returns'
            ],
            assumptions: [
                'Historical market returns of 10-12% for equity',
                'Inflation rate assumed at 6%',
                'No major regulatory changes',
                'Regular monthly investments assumed'
            ],
            bestCase: 'If markets perform well, you could achieve 15-18% returns, reaching your goal 2-3 years early.',
            worstCase: 'In a prolonged downturn, expect 3-5% returns initially. The portfolio is designed to recover over your time horizon.',
            risks: [
                'Market volatility may cause short-term losses',
                'International exposure carries currency risk',
                'Past performance does not guarantee future results'
            ]
        },
        {
            id: 2,
            name: 'Conservative Income Portfolio',
            type: 'Lower risk alternative',
            suitability: 78,
            allocation: {
                'Government Bonds': 40,
                'Corporate Debt': 30,
                'Large Cap Equity': 20,
                'Gold ETF': 10
            },
            expectedReturn: '7-9% p.a.',
            risk: 'Low',
            reasoning: [
                'More stable returns with lower volatility',
                'Higher allocation to fixed-income instruments',
                'Suitable if you prefer predictability'
            ],
            assumptions: [
                'Bond yields around 7-8%',
                'Limited equity exposure',
                'Conservative growth estimates'
            ],
            bestCase: 'Steady 8-10% returns with minimal volatility and consistent income.',
            worstCase: 'During rising interest rates, bond values may temporarily decline 2-3%.',
            risks: [
                'Lower growth may not beat inflation significantly',
                'Interest rate changes affect bond values',
                'May take longer to reach aggressive goals'
            ]
        }
    ];



    const compatibleAdvisors = [
        {
            name: 'Priya Mehta, CFA',
            specialization: 'Retirement & Wealth Planning',
            experience: '12 years',
            match: 94,
            matchReasons: ['Risk philosophy alignment', 'Expertise in your goal area', 'Excellent client reviews']
        },
        {
            name: 'Rahul Verma, CFP',
            specialization: 'Goal-Based Investing',
            experience: '8 years',
            match: 87,
            matchReasons: ['Strong goal planning track record', 'Moderate risk approach']
        }
    ];

    if (!profile) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Sidebar />
                <div className="md:ml-64 p-6 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-slate-500 mb-4">Please complete the onboarding first</p>
                        <button
                            onClick={() => navigate('/investor-onboarding')}
                            className="px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold"
                        >
                            Start Onboarding
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />

            <div className="md:ml-64 p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate('/investor-onboarding')}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Your Personalized Recommendations</h1>
                            <p className="text-sm text-slate-500">Based on your goals, risk tolerance, and preferences</p>
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-3xl p-6 mb-8 text-white">
                        <h2 className="text-lg font-semibold mb-4">Your Profile Summary</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 rounded-xl p-4">
                                <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Primary Goal</p>
                                <p className="font-semibold">{goalLabels[profile.primaryGoal] || 'Not specified'}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Time Horizon</p>
                                <p className="font-semibold">{horizonLabels[profile.timeHorizon] || 'Not specified'}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Risk Profile</p>
                                <p className="font-semibold">{riskLabels[profile.riskScenario]?.label || 'Not specified'}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Preferences</p>
                                <p className="font-semibold">
                                    {profile.preferences?.prefersSRI ? 'SRI Focus' : 'Standard'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAssumptions(!showAssumptions)}
                            className="mt-4 flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
                        >
                            <Info className="w-4 h-4" />
                            View assumptions used
                            {showAssumptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showAssumptions && (
                            <div className="mt-4 bg-white/10 rounded-xl p-4 text-sm">
                                <ul className="space-y-1 text-white/80">
                                    <li>• Risk score based on scenario-based assessment</li>
                                    <li>• Time horizon determines equity allocation range</li>
                                    <li>• Goals matched to appropriate product categories</li>
                                    <li>• Recommendations filtered by stated exclusions</li>
                                    {aiEnhancementStatus.enabled && (
                                        <li>• AI assistance enabled for enhanced explanations</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6 mb-8">
                        <h2 className="text-lg font-bold text-slate-800">Investment Plans for You</h2>

                        {validatedRecommendations.map((rec) => (
                            <div key={rec.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                                <div className="p-6">
                                    {/* .kiro Validation Warnings */}
                                    {rec.kiroValidation && rec.kiroValidation.warnings.length > 0 && (
                                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle size={16} className="text-amber-600" />
                                                <span className="text-sm font-semibold text-amber-800">
                                                    Kiro Safety Check (Confidence: {rec.kiroValidation.confidenceLevel})
                                                </span>
                                            </div>
                                            {rec.kiroValidation.warnings.map((warning, idx) => (
                                                <p key={idx} className="text-xs text-amber-700 mb-1">
                                                    • {rec.kiroValidation.enhancedWarnings || warning}
                                                </p>
                                            ))}
                                            {rec.kiroValidation.requiresProfessionalConsultation && (
                                                <p className="text-xs text-blue-700 mt-2 font-medium">
                                                    ⚠️ Professional consultation recommended before proceeding
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {rec.id === 1 && (
                                                    <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                                                        {rec.type}
                                                    </span>
                                                )}
                                                {rec.id === 2 && (
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                                                        {rec.type}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800">{rec.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                <Shield className={`w-5 h-5 ${rec.suitability >= 90 ? 'text-teal-500' : 'text-blue-500'}`} />
                                                <span className="text-2xl font-bold text-slate-800">{rec.suitability}%</span>
                                            </div>
                                            <p className="text-xs text-slate-500">Suitability Score</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700 mb-3">Asset Allocation</p>
                                            <div className="space-y-2">
                                                {Object.entries(rec.allocation).map(([asset, percent]) => (
                                                    <div key={asset}>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="text-slate-600">{asset}</span>
                                                            <span className="font-medium text-slate-800">{percent}%</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-slate-700 rounded-full"
                                                                style={{ width: `${percent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 p-3 bg-slate-50 rounded-xl">
                                                    <p className="text-xs text-slate-500 mb-1">Expected Return</p>
                                                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                                                        <TrendingUp className="w-4 h-4 text-teal-500" />
                                                        {rec.expectedReturn}
                                                    </p>
                                                </div>
                                                <div className="flex-1 p-3 bg-slate-50 rounded-xl">
                                                    <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                                                    <p className="font-semibold text-slate-800">{rec.risk}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-slate-700 mb-2">Why this suits you:</p>
                                                <ul className="space-y-1">
                                                    {rec.reasoning.map((reason, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                            <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                                                            {reason}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
                                        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        {expandedRec === rec.id ? 'Hide details' : 'What could go wrong?'}
                                        {expandedRec === rec.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                </div>

                                {expandedRec === rec.id && (
                                    <div className="border-t border-slate-100 bg-slate-50 p-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                                                <p className="text-sm font-semibold text-teal-800 mb-2">Best Case Scenario</p>
                                                <p className="text-sm text-teal-700">{rec.bestCase}</p>
                                            </div>
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <p className="text-sm font-semibold text-amber-800 mb-2">Worst Case Scenario</p>
                                                <p className="text-sm text-amber-700">{rec.worstCase}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                Key Risks to Consider
                                            </p>
                                            <ul className="space-y-1">
                                                {rec.risks.map((risk, idx) => (
                                                    <li key={idx} className="text-sm text-slate-600 ml-6">• {risk}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mt-4 p-3 bg-slate-200/50 rounded-xl">
                                            <p className="text-xs text-slate-600">
                                                <strong>Disclaimer:</strong> Past performance is not indicative of future results.
                                                Investments are subject to market risks. Please read all scheme-related documents carefully before investing.
                                                This recommendation is based on information provided and should not be considered as financial advice.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-6 h-6 text-blue-600" />
                            <h2 className="text-lg font-bold text-slate-800">Advisors Who Match Your Profile</h2>
                        </div>
                        <p className="text-sm text-slate-500 mb-6">Based on your goals and risk tolerance, these advisors are best suited to guide you.</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            {compatibleAdvisors.map((advisor, idx) => (
                                <div key={idx} className="p-4 border border-slate-200 rounded-xl">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-slate-800">{advisor.name}</h3>
                                            <p className="text-sm text-slate-500">{advisor.specialization}</p>
                                            <p className="text-xs text-slate-400">{advisor.experience} experience</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-blue-600">{advisor.match}%</div>
                                            <p className="text-xs text-slate-500">Match</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {advisor.matchReasons.map((reason, ridx) => (
                                            <span key={ridx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                                {reason}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 mb-8">
                        <p className="text-xs text-slate-600">
                            <strong>Important:</strong> These recommendations are generated based on the information you provided and are for educational purposes.
                            Before making any investment decisions, please consult with a SEBI-registered financial advisor.
                            All investments carry risk and you may lose some or all of your principal.
                        </p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-amber-800 mb-2">Approval Required Before Investment</h3>
                                <p className="text-sm text-amber-700 mb-3">
                                    These are recommendations only. No investments will be made without your explicit approval.
                                    You maintain full control over all investment decisions.
                                </p>
                                <p className="text-xs text-amber-600">
                                    Next steps: Review → Discuss with advisor → Approve → Execute
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate('/investor-onboarding')}
                            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                        >
                            Modify My Preferences
                        </button>
                        <button
                            onClick={() => navigate('/advisor-dashboard')}
                            className="px-8 py-3 bg-slate-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Connect with an Advisor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorRecommendations;
