import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ArrowRight, ArrowLeft, Target, Clock, Shield, Leaf, Check, ChevronRight } from 'lucide-react';

const InvestorOnboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        goals: [],
        primaryGoal: null,
        timeHorizon: null,
        riskScenario: null,
        preferences: {
            excludedSectors: [],
            prefersSRI: false,
            liquidityNeeds: null
        }
    });

    const totalSteps = 5;

    const goalOptions = [
        { id: 'retirement', label: 'Retirement Planning', desc: 'Build a comfortable retirement corpus', icon: '🏖️' },
        { id: 'wealth', label: 'Wealth Creation', desc: 'Grow your money over time', icon: '📈' },
        { id: 'home', label: 'Home Purchase', desc: 'Save for your dream home', icon: '🏠' },
        { id: 'education', label: 'Child Education', desc: 'Fund quality education for your children', icon: '🎓' },
        { id: 'emergency', label: 'Emergency Fund', desc: 'Build a safety net for unexpected expenses', icon: '🛡️' },
        { id: 'travel', label: 'Travel & Experiences', desc: 'Plan for memorable experiences', icon: '✈️' }
    ];

    const timeHorizonOptions = [
        { id: 'short', label: '1-3 Years', desc: 'Short-term goals like buying a car or travel', risk: 'Low' },
        { id: 'medium', label: '3-7 Years', desc: 'Medium-term like home down payment', risk: 'Moderate' },
        { id: 'long', label: '7-15 Years', desc: 'Long-term like child education', risk: 'Moderate-High' },
        { id: 'verylong', label: '15+ Years', desc: 'Very long-term like retirement', risk: 'Higher Growth' }
    ];

    const riskScenarios = [
        {
            id: 'conservative',
            scenario: 'Market drops 20% temporarily',
            reaction: 'I would lose sleep and consider selling everything',
            label: 'Conservative',
            desc: 'Steady and safe growth, minimal volatility',
            score: 3
        },
        {
            id: 'moderate',
            scenario: 'Market drops 20% temporarily',
            reaction: 'I\'d be concerned but understand markets recover',
            label: 'Moderate',
            desc: 'Balanced approach with some market exposure',
            score: 5
        },
        {
            id: 'growth',
            scenario: 'Market drops 20% temporarily',
            reaction: 'I might see it as a buying opportunity',
            label: 'Growth',
            desc: 'Higher growth potential with more volatility',
            score: 7
        },
        {
            id: 'aggressive',
            scenario: 'Market drops 20% temporarily',
            reaction: 'I\'d definitely buy more at lower prices',
            label: 'Aggressive',
            desc: 'Maximum growth focus, comfortable with large swings',
            score: 9
        }
    ];

    const sectorOptions = [
        { id: 'tobacco', label: 'Tobacco & Alcohol' },
        { id: 'gambling', label: 'Gambling' },
        { id: 'weapons', label: 'Weapons & Defense' },
        { id: 'fossil', label: 'Fossil Fuels' },
        { id: 'none', label: 'No exclusions' }
    ];

    const toggleGoal = (goalId) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.includes(goalId)
                ? prev.goals.filter(g => g !== goalId)
                : [...prev.goals, goalId]
        }));
    };

    const toggleSector = (sectorId) => {
        if (sectorId === 'none') {
            setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, excludedSectors: [] }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    excludedSectors: prev.preferences.excludedSectors.includes(sectorId)
                        ? prev.preferences.excludedSectors.filter(s => s !== sectorId)
                        : [...prev.preferences.excludedSectors, sectorId]
                }
            }));
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return formData.goals.length > 0;
            case 2: return formData.primaryGoal !== null;
            case 3: return formData.timeHorizon !== null;
            case 4: return formData.riskScenario !== null;
            case 5: return true;
            default: return false;
        }
    };

    const handleComplete = () => {
        navigate('/investor-recommendations', { state: { profile: formData } });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">What are your financial goals?</h2>
                            <p className="text-slate-500">Select all that apply. We'll help prioritize in the next step.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {goalOptions.map(goal => (
                                <button
                                    key={goal.id}
                                    onClick={() => toggleGoal(goal.id)}
                                    className={`p-5 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${
                                        formData.goals.includes(goal.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                                >
                                    <span className="text-3xl">{goal.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-slate-800">{goal.label}</h3>
                                            {formData.goals.includes(goal.id) && (
                                                <Check className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{goal.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Which goal matters most right now?</h2>
                            <p className="text-slate-500">We'll focus our initial recommendations on this priority.</p>
                        </div>
                        <div className="space-y-3 max-w-lg mx-auto">
                            {formData.goals.map(goalId => {
                                const goal = goalOptions.find(g => g.id === goalId);
                                return (
                                    <button
                                        key={goalId}
                                        onClick={() => setFormData(prev => ({ ...prev, primaryGoal: goalId }))}
                                        className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                                            formData.primaryGoal === goalId
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }`}
                                    >
                                        <span className="text-2xl">{goal.icon}</span>
                                        <span className="font-semibold text-slate-800 flex-1">{goal.label}</span>
                                        {formData.primaryGoal === goalId && (
                                            <Check className="w-5 h-5 text-blue-600" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">When do you need this money?</h2>
                            <p className="text-slate-500">Your time horizon helps us recommend the right investment approach.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            {timeHorizonOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => setFormData(prev => ({ ...prev, timeHorizon: option.id }))}
                                    className={`p-5 rounded-2xl border-2 transition-all text-left ${
                                        formData.timeHorizon === option.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-slate-400" />
                                            <h3 className="font-semibold text-slate-800">{option.label}</h3>
                                        </div>
                                        {formData.timeHorizon === option.id && (
                                            <Check className="w-5 h-5 text-blue-600" />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2">{option.desc}</p>
                                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                        Risk capacity: {option.risk}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">How would you react to market volatility?</h2>
                            <p className="text-slate-500">Imagine your portfolio value dropped 20% during a market downturn. How would you feel?</p>
                        </div>
                        <div className="space-y-4 max-w-2xl mx-auto">
                            {riskScenarios.map(scenario => (
                                <button
                                    key={scenario.id}
                                    onClick={() => setFormData(prev => ({ ...prev, riskScenario: scenario.id }))}
                                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                                        formData.riskScenario === scenario.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Shield className={`w-5 h-5 ${
                                                    scenario.id === 'conservative' ? 'text-blue-500' :
                                                    scenario.id === 'moderate' ? 'text-teal-500' :
                                                    scenario.id === 'growth' ? 'text-amber-500' :
                                                    'text-red-500'
                                                }`} />
                                                <h3 className="font-semibold text-slate-800">{scenario.label}</h3>
                                            </div>
                                            <p className="text-slate-700 mb-2 italic">"{scenario.reaction}"</p>
                                            <p className="text-sm text-slate-500">{scenario.desc}</p>
                                        </div>
                                        {formData.riskScenario === scenario.id && (
                                            <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Any investment preferences?</h2>
                            <p className="text-slate-500">Optional: Tell us if you want to exclude certain sectors or prefer sustainable investing.</p>
                        </div>
                        
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-4">Sectors you'd prefer to avoid:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sectorOptions.map(sector => (
                                        <button
                                            key={sector.id}
                                            onClick={() => toggleSector(sector.id)}
                                            className={`px-4 py-2 rounded-full border transition-all text-sm ${
                                                (sector.id === 'none' && formData.preferences.excludedSectors.length === 0) ||
                                                formData.preferences.excludedSectors.includes(sector.id)
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            {sector.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    preferences: { ...prev.preferences, prefersSRI: !prev.preferences.prefersSRI }
                                }))}
                                className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                                    formData.preferences.prefersSRI
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}
                            >
                                <Leaf className={`w-6 h-6 ${formData.preferences.prefersSRI ? 'text-teal-600' : 'text-slate-400'}`} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800">Sustainable & Responsible Investing (SRI)</h3>
                                    <p className="text-sm text-slate-500">Prioritize companies with positive environmental and social impact</p>
                                </div>
                                {formData.preferences.prefersSRI && (
                                    <Check className="w-5 h-5 text-teal-600" />
                                )}
                            </button>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-4">How soon might you need to access this money unexpectedly?</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Low - Unlikely to need it', 'Medium - Might need some', 'High - May need quick access'].map((option, idx) => {
                                        const value = ['low', 'medium', 'high'][idx];
                                        return (
                                            <button
                                                key={value}
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    preferences: { ...prev.preferences, liquidityNeeds: value }
                                                }))}
                                                className={`px-4 py-2 rounded-full border transition-all text-sm ${
                                                    formData.preferences.liquidityNeeds === value
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            
            <div className="md:ml-64 p-6 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">Get Started</h1>
                                <p className="text-sm text-slate-500">Tell us about yourself</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            {Array.from({ length: totalSteps }, (_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 h-2 rounded-full transition-colors ${
                                        i + 1 <= step ? 'bg-slate-800' : 'bg-slate-200'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-slate-500">Step {step} of {totalSteps}</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 p-8 mb-6">
                        {renderStep()}
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setStep(s => Math.max(1, s - 1))}
                            disabled={step === 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                                step === 1
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>

                        {step < totalSteps ? (
                            <button
                                onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
                                disabled={!canProceed()}
                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                                    canProceed()
                                        ? 'bg-slate-800 text-white shadow-lg hover:shadow-xl'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Continue
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                See My Recommendations
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorOnboarding;
