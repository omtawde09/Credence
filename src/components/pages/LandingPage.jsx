import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Eye, Users } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-medium text-gray-900">Credence</div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate('/advisor')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            For advisors
          </button>
          <button 
            onClick={() => navigate('/onboarding')}
            className="text-sm text-gray-900 font-medium"
          >
            Sign in
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        <section className="pt-20 pb-24 fade-in">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight mb-6">
              Intelligent Advisor–Investor Journey Management
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              Personalized, transparent investment guidance built on trust. 
              Connect with qualified advisors who understand your goals and 
              provide clear, explainable recommendations.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/onboarding')}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Start your journey
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/advisor')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                For advisors
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-gray-100 slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-sm text-gray-400 mb-3">01</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tell us about yourself</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Answer a few simple questions about your financial goals, 
                timeline, and comfort with risk. No jargon, no complexity.
              </p>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-3">02</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Get matched with an advisor</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We connect you with a qualified advisor who specializes in 
                your type of investment needs and preferences.
              </p>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-3">03</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Receive clear recommendations</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every recommendation comes with a full explanation of 
                why it suits your situation. No black boxes.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-gray-100 slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-12">
            Built on trust
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Eye size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Transparent advice</h3>
                <p className="text-sm text-gray-600">
                  Every recommendation is explained in plain language. 
                  You always know why.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Regulated ecosystem</h3>
                <p className="text-sm text-gray-600">
                  All advisors are qualified and operate within 
                  regulatory frameworks.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Users size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Human-first approach</h3>
                <p className="text-sm text-gray-600">
                  Technology assists, but qualified humans make the 
                  important decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Credence — Intelligent investment guidance
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
