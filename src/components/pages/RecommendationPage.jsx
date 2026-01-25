import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, User } from 'lucide-react';

const RecommendationPage = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const allocation = [
    { name: 'Equity - Large Cap', percentage: 40, color: 'bg-blue-500' },
    { name: 'Equity - Mid Cap', percentage: 15, color: 'bg-blue-400' },
    { name: 'Debt - Government Bonds', percentage: 25, color: 'bg-gray-400' },
    { name: 'Debt - Corporate Bonds', percentage: 15, color: 'bg-gray-300' },
    { name: 'Gold', percentage: 5, color: 'bg-yellow-400' }
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="text-xl font-medium text-gray-900">
          Credence
        </button>
        <button
          onClick={() => navigate('/onboarding')}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Edit profile
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        <button
          onClick={() => navigate('/onboarding')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={16} />
          Back to profile
        </button>

        <header className="mb-12 fade-in">
          <h1 className="text-3xl font-medium text-gray-900 mb-3">Your Investment Recommendation</h1>
          <p className="text-gray-600">
            Based on your goals, timeline, and risk tolerance, here's a personalized plan.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-12 slide-up">
          <div className="md:col-span-2">
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                Recommended allocation
              </h2>
              <div className="flex h-3 rounded-full overflow-hidden mb-6">
                {allocation.map((item, i) => (
                  <div
                    key={i}
                    className={`${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                ))}
              </div>
              <div className="space-y-3">
                {allocation.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-gray-900 font-medium">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="text-sm text-gray-500 mb-1">Risk level</div>
                <div className="text-lg font-medium text-gray-900">Moderate</div>
                <p className="text-xs text-gray-600 mt-2">
                  Balanced approach with mix of growth and stability
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="text-sm text-gray-500 mb-1">Expected return range</div>
                <div className="text-lg font-medium text-gray-900">8% – 12% p.a.</div>
                <p className="text-xs text-gray-600 mt-2">
                  Based on historical performance, not guaranteed
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="border border-gray-200 rounded-lg p-5 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Matched advisor</div>
                  <div className="text-xs text-gray-500">Priya Sharma, CFP</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-600">Compatibility</span>
                <span className="text-gray-900 font-medium">92%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Specializes in long-term wealth building
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-sm text-gray-500 mb-2">Annual fee estimate</div>
              <div className="text-lg font-medium text-gray-900">0.75%</div>
              <p className="text-xs text-gray-600 mt-2">
                Includes advisory and fund management fees
              </p>
            </div>
          </div>
        </div>

        <section className="border-t border-gray-100 pt-8 mb-8 slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-medium text-gray-900 mb-6">Why this recommendation?</h2>
          
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('goals')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="font-medium text-gray-900">Aligned with your goals</span>
                </div>
                {expandedSection === 'goals' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'goals' && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  Your goal of wealth building over 10+ years allows for a growth-oriented 
                  allocation. The equity component provides long-term appreciation potential 
                  while debt instruments add stability.
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('risk')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="font-medium text-gray-900">Matches your risk tolerance</span>
                </div>
                {expandedSection === 'risk' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'risk' && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  Based on your moderate risk appetite, this allocation balances growth 
                  potential with downside protection. The 55% equity / 40% debt / 5% gold 
                  split historically shows lower volatility than pure equity portfolios.
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('suitability')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="font-medium text-gray-900">Suitability assessment passed</span>
                </div>
                {expandedSection === 'suitability' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'suitability' && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  This recommendation meets regulatory suitability requirements. The products 
                  selected are appropriate for your investment experience, financial situation, 
                  and stated objectives.
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('risks')}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={18} className="text-amber-500" />
                  <span className="font-medium text-gray-900">What could go wrong?</span>
                </div>
                {expandedSection === 'risks' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'risks' && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  <ul className="space-y-2">
                    <li>• Market downturns could temporarily reduce portfolio value by 15-25%</li>
                    <li>• Returns are not guaranteed and may be lower than expected</li>
                    <li>• Inflation may erode real returns over time</li>
                    <li>• Early withdrawal may result in losses or penalties</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="bg-gray-50 rounded-lg p-6 text-sm text-gray-600 slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="font-medium text-gray-900 mb-2">Important disclaimer</p>
          <p>
            This recommendation is based on information you provided and is for informational 
            purposes only. Past performance does not guarantee future results. Please consult 
            with your matched advisor before making investment decisions. All investments 
            carry risk, including potential loss of principal.
          </p>
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate('/advisor')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Proceed with this plan
          </button>
        </div>
      </main>
    </div>
  );
};

export default RecommendationPage;
