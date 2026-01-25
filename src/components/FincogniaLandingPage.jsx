import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CredenceLandingPage = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const words = ["anticipates", "protects", "secures", "optimizes"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center pt-32">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-slate-100/20 rounded-full blur-[120px] -z-10" />

      {/* HERO SECTION 1: Finance that... */}
      <div className="max-w-7xl mx-auto text-center relative z-20 mb-12 px-6">
        <span className="inline-block px-4 py-1.5 mb-6 text-[11px] font-bold tracking-widest uppercase bg-slate-100 text-slate-700 rounded-full border border-slate-200">
          Agentic Finance for Gig-Earners
        </span>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.9] mb-8">
          Finance that <br />
          <div className="relative inline-block h-[1.1em] overflow-hidden align-bottom">
            {words.map((word, i) => (
              <span
                key={word}
                className={`absolute left-0 w-full text-gray-300 italic font-light transition-all duration-700 ease-in-out ${i === index
                  ? "translate-y-0 opacity-100"
                  : i < index
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0"
                  }`}
                style={{ whiteSpace: "nowrap" }}
              >
                {word}.
              </span>
            ))}
            {/* Invisible spacer to maintain height */}
            <span className="opacity-0 italic font-light">anticipates.</span>
          </div>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
          Credence is an AI financial co-pilot that forecasts cashflow storms
          and{" "}
          <span className="text-slate-800 font-semibold">
            autonomously acts
          </span>{" "}
          to prevent credit damage.
        </p>
      </div>

      {/* HERO SECTION 2: Agentic Capital + 3D */}
      <div className="relative flex-grow w-full flex flex-col items-center justify-center">
        {/* TEXT CONTENT */}
        <div className="relative z-30 text-center pointer-events-none px-6 mb-8 mt-12">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-6">
            Agentic <br />
            <span className="text-slate-400 italic font-light">Capital</span>.
          </h1>
          <p className="max-w-md mx-auto text-sm md:text-base text-slate-600 font-medium">
            The first AI co-pilot that doesn't just show you charts, but{" "}
            <span className="text-slate-800">autonomously secures</span> your
            solvency.
          </p>

          <div className="mt-8 flex gap-3 justify-center pointer-events-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-2xl active:scale-95 transition-all hover:bg-blue-700"
            >
              Launch Live Demo
            </button>
          </div>
        </div>

        {/* 3D MODEL CONTAINER - Disabled due to WebGL compatibility */}
        <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-full h-[90vh] pointer-events-auto flex items-center justify-center">
            <div className="text-9xl text-amber-500 animate-pulse">₿</div>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-[32px] p-10 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-900/5 transition-all">
            <div className="max-w-md">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl mb-6">
                ⛅
              </div>
              <h3 className="text-3xl font-bold mb-4">Money Weather™</h3>
              <p className="text-slate-600 leading-relaxed">
                Our proprietary ML model simulates 10,000+ cashflow scenarios to
                predict your "Financial Storms." It detects liquidity gaps
                before your bank does.
              </p>
            </div>
            <div className="mt-10 h-32 w-full bg-slate-100/30 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-[10px] uppercase tracking-widest text-slate-500">
              [ Probabilistic Forecast Visual ]
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[32px] p-10 flex flex-col justify-between">
            <h3 className="text-2xl font-bold leading-tight">
              Autonomous Agentic Actions
            </h3>
            <p className="opacity-90 text-sm mt-4">
              With your consent, Credence locks safety buffers and alerts
              you when the risk of an EMI bounce exceeds 85%.
            </p>
            <div className="mt-8 pt-6 border-t border-slate-50/20 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] font-mono opacity-80">
                MONITORING LIVE STREAMS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM METRICS */}
      <div className="w-full max-w-6xl px-10 pb-12 flex justify-between items-center z-20 pointer-events-none opacity-40">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
            System Status
          </span>
          <span className="text-xl font-mono font-bold italic">ENCRYPTED</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Uptime
          </span>
          <span className="text-xl font-mono font-bold">99.9%</span>
        </div>
      </div>
    </main>
  );
};

export default CredenceLandingPage;
