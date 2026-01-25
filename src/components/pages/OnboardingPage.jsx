import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    goal: '',
    timeHorizon: 10,
    riskAppetite: '',
    preferences: []
  });

  const totalSteps = 4;

  const goals = [
    { id: 'retirement', label: 'Retirement', desc: 'Build wealth for a comfortable retirement' },
    { id: 'wealth', label: 'Wealth building', desc: 'Grow your assets over time' },
    { id: 'home', label: 'Buy a home', desc: 'Save for a down payment or property' },
    { id: 'education', label: 'Education', desc: 'Fund education for yourself or family' }
  ];

  const riskScenarios = [
    { id: 'conservative', label: 'Preserve what I have', desc: 'I prefer stability over high returns. A 5% loss would concern me.' },
    { id: 'moderate', label: 'Balanced growth', desc: 'I can accept some volatility for better returns. A 15% temporary drop is acceptable.' },
    { id: 'aggressive', label: 'Maximize growth', desc: 'I focus on long-term gains. Short-term losses of 30%+ don\'t worry me.' }
  ];

  const preferenceOptions = [
    { id: 'lowcost', label: 'Low-cost funds' },
    { id: 'ethical', label: 'Ethical/ESG investing' },
    { id: 'passive', label: 'Passive index funds' },
    { id: 'active', label: 'Actively managed funds' },
    { id: 'dividend', label: 'Dividend-focused' }
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/recommendation');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const togglePreference = (id) => {
    setAnswers(prev => ({
      ...prev,
      preferences: prev.preferences.includes(id)
        ? prev.preferences.filter(p => p !== id)
        : [...prev.preferences, id]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="max-w-3xl mx-auto px-6 py-6 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="text-xl font-medium text-gray-900">
          Credence
        </button>
        <div className="text-sm text-gray-500">
          Step {step} of {totalSteps}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-4 mb-8">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <main className="max-w-xl mx-auto px-6 pb-24">
        {step === 1 && (
          <div className="fade-in">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">What's your primary goal?</h1>
            <p className="text-gray-600 mb-8">This helps us understand what you're working toward.</p>
            <div className="space-y-3">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setAnswers({ ...answers, goal: goal.id })}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers.goal === goal.id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{goal.label}</div>
                      <div className="text-sm text-gray-600">{goal.desc}</div>
                    </div>
                    {answers.goal === goal.id && <Check size={20} className="text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">What's your time horizon?</h1>
            <p className="text-gray-600 mb-8">How long do you plan to keep this money invested?</p>
            <div className="py-8">
              <div className="text-center mb-8">
                <span className="text-5xl font-light text-gray-900">{answers.timeHorizon}</span>
                <span className="text-xl text-gray-600 ml-2">years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={answers.timeHorizon}
                onChange={(e) => setAnswers({ ...answers, timeHorizon: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>1 year</span>
                <span>30 years</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-8">
              <p className="text-sm text-gray-600">
                {answers.timeHorizon <= 3 && "Short-term investments prioritize capital preservation."}
                {answers.timeHorizon > 3 && answers.timeHorizon <= 10 && "Medium-term allows for balanced growth with moderate risk."}
                {answers.timeHorizon > 10 && "Long-term horizons can weather market volatility for higher potential returns."}
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">How do you feel about risk?</h1>
            <p className="text-gray-600 mb-8">Consider how you'd react to market downturns.</p>
            <div className="space-y-3">
              {riskScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => setAnswers({ ...answers, riskAppetite: scenario.id })}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers.riskAppetite === scenario.id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{scenario.label}</div>
                      <div className="text-sm text-gray-600">{scenario.desc}</div>
                    </div>
                    {answers.riskAppetite === scenario.id && <Check size={20} className="text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fade-in">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">Any investment preferences?</h1>
            <p className="text-gray-600 mb-8">Select all that apply. This is optional.</p>
            <div className="flex flex-wrap gap-2">
              {preferenceOptions.map(pref => (
                <button
                  key={pref.id}
                  onClick={() => togglePreference(pref.id)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    answers.preferences.includes(pref.id)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {answers.preferences.includes(pref.id) && <Check size={14} className="inline mr-1" />}
                  {pref.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 text-sm ${step === 1 ? 'text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={step === 1 && !answers.goal}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {step === totalSteps ? 'See recommendations' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
