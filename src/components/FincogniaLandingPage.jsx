import { useNavigate } from "react-router-dom";
import { Users, Target, Shield, TrendingUp, UserCheck, AlertTriangle, FileText } from 'lucide-react';

const CredenceLandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: 'Goal-Based Onboarding',
      description: 'Conversational journey to capture investor goals, risk tolerance, and time horizon using real scenarios.'
    },
    {
      icon: Shield,
      title: 'Explainable Recommendations',
      description: 'Transparent investment suggestions with clear reasoning, assumptions, and "what could go wrong" explanations.'
    },
    {
      icon: UserCheck,
      title: 'Advisor-Investor Matching',
      description: 'Compatibility scoring based on risk philosophy, expertise alignment, and experience.'
    },
    {
      icon: AlertTriangle,
      title: 'Risk Mismatch Detection',
      description: 'Continuous monitoring comparing stated vs actual portfolio risk with suggested rebalancing.'
    },
    {
      icon: TrendingUp,
      title: 'Life-Event Re-Planning',
      description: 'Automatic detection of life changes triggering portfolio review and assumption updates.'
    },
    {
      icon: FileText,
      title: 'Transparency & Disclosure',
      description: 'Full fee disclosure, conflict-of-interest declarations, and SEBI-compliant regulatory statements.'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1.5 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800">CREDENCE</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/investor-onboarding')}
              className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Investor Journey
            </button>
            <button
              onClick={() => navigate('/advisor-dashboard')}
              className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Advisor Portal
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
            >
              Launch Demo
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-blue-100 text-blue-700 rounded-full">
            Hackathon Demo
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-800 mb-6 leading-tight">
            Intelligent Platform for<br />
            <span className="text-blue-600">
              Advisor & Investor
            </span><br />
            Journey Management
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
            A complete platform for managing financial advisors at scale while providing 
            personalized, explainable investment guidance to retail investors. 
            Built on trust, transparency, and suitability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/investor-onboarding')}
              className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              Start Investor Journey
            </button>
            <button
              onClick={() => navigate('/advisor-dashboard')}
              className="bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold text-base border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Open Advisor Portal
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Problem Statement</h2>
            <p className="max-w-3xl mx-auto text-lg text-slate-600">
              Design an interactive FinTech platform to manage a large network of financial advisors 
              and provide personalized investment guidance to retail investors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-3xl p-8 text-white">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Advisor Management</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Efficiently organize and manage hundreds of financial advisors and portfolio managers 
                with client overviews, alerts, and quick summaries.
              </p>
            </div>

            <div className="bg-slate-800 rounded-3xl p-8 text-white">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Investor Journey</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Capture investor goals, risk appetite, and preferences through a conversational, 
                human-centered experience—not a long form.
              </p>
            </div>

            <div className="bg-slate-800 rounded-3xl p-8 text-white">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trust & Transparency</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Present recommendations in a clear, defensible manner with full disclosure 
                of fees, conflicts, and suitability notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Key Features</h2>
            <p className="text-slate-600">Six intelligent capabilities that power the platform</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience the Demo?</h2>
          <p className="text-slate-300 mb-10 max-w-2xl mx-auto">
            Explore both the investor journey (goal capture → recommendations) and the 
            advisor experience (client management → intelligent alerts).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/investor-onboarding')}
              className="bg-white text-slate-800 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              Start as Investor
            </button>
            <button
              onClick={() => navigate('/advisor-dashboard')}
              className="bg-white/10 text-white px-8 py-4 rounded-2xl font-bold border border-white/20 hover:bg-white/20 transition-all"
            >
              Open as Advisor
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1 rounded-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">CREDENCE</span>
          </div>
          <p className="text-sm text-slate-500">Hackathon Demo — Intelligent Advisor & Investor Platform</p>
        </div>
      </footer>
    </main>
  );
};

export default CredenceLandingPage;
