import React, { useState, useRef } from 'react';
import useAuthStore from '../store/useAuthStore';
import Sidebar from './Sidebar';
import { Calendar as CalendarIcon, Clock, ChevronDown, Check, X, Shield, Star, Filter, MoreHorizontal, Plus } from 'lucide-react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ApplicationFormModal from './ApplicationFormModal';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const PolicyPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [premiumAmount, setPremiumAmount] = useState('');
    const [insuranceType, setInsuranceType] = useState('Health');
    const [loading, setLoading] = useState(false);
    const [generatedPolicies, setGeneratedPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null); // For Modal
    const resultsRef = useRef(null);

    // Mock Data for Suggested Policies (Restored)
    const suggestedPolicies = [
        { id: 1, name: 'Term Life Plus', provider: 'Insurance A', premium: '₹12k/yr', coverage: '₹1Cr', match: 96 },
        { id: 2, name: 'Health Optima', provider: 'Insurance B', premium: '₹15k/yr', coverage: '₹10L', match: 88 },
        { id: 3, name: 'Secure Drive', provider: 'Insurance C', premium: '₹5k/yr', coverage: 'Vehicle', match: 81 },
        { id: 4, name: 'Pension Gtd', provider: 'Insurance D', premium: '₹50k/yr', coverage: 'Retirement', match: 72 },
    ];

    // Gemini API Setup
    // WARNING: In a production app, never hardcode API keys on the client.
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    const fetchPolicies = async () => {
        if (!premiumAmount || !insuranceType) return;

        setLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Act as an expert insurance advisor for the Indian market. Based on a yearly premium of ₹${premiumAmount} and insurance type '${insuranceType}', suggest 3 real, specific insurance policies available in India. 
            
            Return ONLY a raw JSON array (no markdown code blocks) with objects containing these keys:
            - id: number
            - name: Policy Name
            - provider: Insurance Company Name
            - premium: e.g., "₹12k/yr" (formatted)
            - coverage: e.g., "₹5 Lakhs" (approx coverage for the premium)
            - match: number (e.g., 95)
            - pros: array of 2 short strings
            - con: 1 short string description of a limitation or trade-off
            
            Ensure the response is valid JSON and nothing else.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean up code blocks if Gemini returns them
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const policies = JSON.parse(cleanText);
            setGeneratedPolicies(policies);

            // Scroll to results
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (error) {
            console.error("Error generating policies:", error);
            alert("Failed to generate policies. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    // Mock Events for Calendar
    const events = [
        {
            title: 'Health Policy Renewal',
            start: new Date(2025, 11, 28), // Dec 28, 2025
            end: new Date(2025, 11, 28),
            resource: 'policy'
        },
        {
            title: 'Car Insurance Due',
            start: new Date(2025, 11, 31), // Dec 31, 2025
            end: new Date(2025, 11, 31),
            resource: 'payment'
        },
        {
            title: 'Meeting with Agent',
            start: new Date(2025, 11, 5, 14, 0), // Dec 5, 2025, 2:00 PM
            end: new Date(2025, 11, 5, 15, 0),
            resource: 'policy'
        },
        {
            title: 'Life Insurance Premium',
            start: new Date(2025, 11, 10), // Dec 10, 2025
            end: new Date(2025, 11, 10),
            resource: 'payment'
        },
        {
            title: 'Tax Planning Review',
            start: new Date(2025, 11, 15), // Dec 15, 2025
            end: new Date(2025, 11, 15),
            resource: 'policy'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF7] text-[#1E3A2F] selection:bg-[#CFE3D8] selection:text-[#1E3A2F] font-sans overflow-hidden">
            <Sidebar />

            {/* Main Wrapper */}
            <div className="md:ml-64 p-6 h-screen overflow-y-auto">

                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-[#CFE3D8] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#E6EFEA] transition-colors shadow-sm" onClick={() => navigate('/agents')}>
                            <span className="font-bold text-lg text-[#1E3A2F]">←</span>
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-[#1E3A2F]">Policy Agent</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#CFE3D8] shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#1E3A2F]">Monitoring Active</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#1E3A2F] font-bold border border-white shadow-sm">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-1 flex flex-col gap-6">

                        {/* CUSTOMER INPUT (Replacing User/Web Surfing) */}
                        <div className="bg-white rounded-[32px] p-6 border border-[#CFE3D8] shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Policy Config</h3>
                                <MoreHorizontal size={16} className="text-gray-400" />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-[#1E3A2F]/60 mb-2 block uppercase tracking-wider">Affordable Premium (Yearly)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E3A2F] font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={premiumAmount}
                                            onChange={(e) => setPremiumAmount(e.target.value)}
                                            placeholder="25,000"
                                            className="w-full bg-[#FAFAF7] border border-[#CFE3D8] rounded-2xl py-4 pl-10 pr-4 text-xl font-bold text-[#1E3A2F] focus:outline-none focus:border-[#1E3A2F] focus:ring-1 focus:ring-[#1E3A2F] transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#1E3A2F]/60 mb-2 block uppercase tracking-wider">Insurance Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Health', 'Life', 'Motor', 'Home'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setInsuranceType(type)}
                                                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${insuranceType === type
                                                    ? 'bg-[#1E3A2F] text-white border-[#1E3A2F] shadow-lg shadow-[#1E3A2F]/20'
                                                    : 'bg-white text-gray-400 border-[#CFE3D8] hover:border-[#1E3A2F] hover:text-[#1E3A2F]'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={fetchPolicies}
                                    disabled={loading || !premiumAmount}
                                    className={`w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${loading || !premiumAmount
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-[#1E3A2F] text-white hover:bg-[#2A4D3F] shadow-lg shadow-[#1E3A2F]/30 hover:scale-[1.02]'
                                        }`}
                                >
                                    {loading ? 'Analyzing...' : 'Find Best Policies'}
                                </button>
                            </div>
                        </div>

                        {/* SUGGESTED POLICIES (Mock Data) */}
                        <div className="bg-white rounded-[32px] p-6 border border-[#CFE3D8] flex-[1.5] flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Suggested Policies</h3>
                                <Filter size={14} className="text-gray-400" />
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {suggestedPolicies.map((policy) => (
                                    <div key={policy.id} className="bg-[#FAFAF7] p-4 rounded-2xl flex items-center justify-between border border-[#CFE3D8] hover:border-[#1E3A2F]/30 transition-all group cursor-pointer" onClick={() => setSelectedPolicy(policy)}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#1E3A2F] border border-[#CFE3D8] group-hover:scale-110 transition-transform shadow-sm">
                                                {policy.match}%
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-[#1E3A2F] group-hover:text-emerald-600 transition-colors">{policy.name}</h4>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{policy.provider}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#1E3A2F]">{policy.premium}</p>
                                            <p className="text-[10px] text-gray-400 uppercase">{policy.coverage}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#CFE3D8] flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1E3A2F]"></span>Top Match</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Value</span>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - CALENDAR & TIMELINE */}
                    <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-[#CFE3D8] flex flex-col relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-fit min-h-[600px]">
                        <div className="flex justify-between items-center mb-8 z-10">
                            <div>
                                <h3 className="text-xl font-bold mb-1 text-[#1E3A2F]">Policy Timeline</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Renewal & Payment Schedule</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-full bg-[#FAFAF7] border border-[#CFE3D8] flex items-center justify-center hover:bg-[#E6EFEA] transition-colors text-[#1E3A2F] text-lg">‹</button>
                                <button className="w-8 h-8 rounded-full bg-[#FAFAF7] border border-[#CFE3D8] flex items-center justify-center hover:bg-[#E6EFEA] transition-colors text-[#1E3A2F] text-lg">›</button>
                            </div>
                        </div>

                        {/* Calendar Container */}
                        <div className="flex-1 policy-calendar-wrapper z-10">
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '500px' }}
                                views={['month', 'week', 'agenda']}
                                defaultView='month'
                                toolbar={false} // Custom toolbar above
                                components={{
                                    event: ({ event }) => (
                                        <div className={`text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border ${event.resource === 'payment'
                                            ? 'bg-orange-50 text-orange-600 border-orange-200'
                                            : 'bg-emerald-50 text-[#1E3A2F] border-emerald-200'
                                            }`}>
                                            {event.title}
                                        </div>
                                    )
                                }}
                            />
                        </div>

                        {/* Floating Action Button */}
                        <button className="absolute bottom-8 left-8 w-12 h-12 bg-[#1E3A2F] hover:bg-[#2A4D3F] rounded-full flex items-center justify-center text-white shadow-xl shadow-[#1E3A2F]/20 transition-all hover:scale-110 z-20">
                            <Plus size={24} />
                        </button>
                    </div>

                </div>

                {/* AI GENERATED RESULTS SECTION */}
                <div ref={resultsRef} className="pb-12">
                    {generatedPolicies.length > 0 && (
                        <div className="animate-fade-in-up">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] flex-1 bg-[#CFE3D8]"></div>
                                <h2 className="text-xl font-black uppercase tracking-tight text-[#1E3A2F] flex items-center gap-2">
                                    <Star size={20} className="text-emerald-500 fill-emerald-500" />
                                    AI Recommendations
                                </h2>
                                <div className="h-[1px] flex-1 bg-[#CFE3D8]"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {generatedPolicies.map((policy) => (
                                    <div key={policy.id} className="bg-white p-6 rounded-[32px] border border-[#CFE3D8] hover:border-[#1E3A2F]/30 transition-all group flex flex-col gap-4 shadow-lg hover:shadow-xl hover:-translate-y-1 duration-300">

                                        {/* Header */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-lg text-[#1E3A2F] group-hover:text-emerald-600 transition-colors">{policy.name}</h4>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">{policy.provider}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="w-10 h-10 rounded-full bg-[#FAFAF7] flex items-center justify-center text-sm font-bold text-[#1E3A2F] border border-[#CFE3D8] shadow-sm mb-1">
                                                    {policy.match}%
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex justify-between items-center py-4 border-y border-[#CFE3D8]/50">
                                            <div>
                                                <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Premium</span>
                                                <span className="text-lg font-black text-[#1E3A2F]">{policy.premium}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Coverage</span>
                                                <span className="text-lg font-black text-emerald-600">{policy.coverage}</span>
                                            </div>
                                        </div>

                                        {/* Pros & Cons */}
                                        <div className="flex-1 space-y-3 bg-[#FAFAF7] p-4 rounded-2xl border border-[#CFE3D8]/30">
                                            {policy.pros.map((pro, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                                        <Check size={12} className="text-emerald-600" />
                                                    </div>
                                                    <p className="text-xs text-[#1E3A2F]/80 font-medium leading-relaxed">{pro}</p>
                                                </div>
                                            ))}
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                                                    <X size={12} className="text-red-500" />
                                                </div>
                                                <p className="text-xs text-[#1E3A2F]/80 font-medium leading-relaxed">{policy.con}</p>
                                            </div>
                                        </div>

                                        {/* Apply Button */}
                                        <button
                                            onClick={() => setSelectedPolicy(policy)}
                                            className="w-full py-4 bg-[#1E3A2F] text-white text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-[#2A4D3F] transition-all shadow-lg shadow-[#1E3A2F]/20 hover:shadow-xl hover:shadow-[#1E3A2F]/30 active:scale-[0.98]"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL (Now Reusable) */}
                <ApplicationFormModal
                    isOpen={!!selectedPolicy}
                    onClose={() => setSelectedPolicy(null)}
                    policy={selectedPolicy}
                    user={user}
                />
            </div>

            {/* Global Styles for react-big-calendar override */}
            <style>{`
                .rbc-calendar { font-family: inherit; color: #1E3A2F; }
                .rbc-header { padding: 12px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #CFE3D8 !important; color: #6b7280; }
                .rbc-month-view { border: none !important; }
                .rbc-day-bg { border-left: 1px solid #CFE3D8 !important; }
                .rbc-off-range-bg { background: transparent !important; }
                .rbc-date-cell { padding: 8px; font-size: 12px; font-weight: 600; color: #1E3A2F; }
                .rbc-off-range .rbc-date-cell { color: #D1D5DB; }
                .rbc-today { background: #E6EFEA !important; }
                .rbc-row-segment { padding: 2px 4px !important; }
            `}</style>
        </div>
    );
};

export default PolicyPage;
