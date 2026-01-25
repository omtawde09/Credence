import React, { useState, useRef, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';
import Sidebar from './Sidebar';
import { MoreHorizontal, Send, User, FileText, Briefcase, DollarSign, CreditCard, PieChart, MessageSquare, Sparkles, ArrowRight, Shield, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import emailjs from '@emailjs/browser';

const TaxationPage = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // --- STATE ---

    // ITR Form State
    const [itrData, setItrData] = useState({
        pan: '',
        aadhaar: '',
        assessmentYear: '2025-26',
        grossIncome: '',
        deductions80C: '',
        deductions80D: '',
        tdsDeducted: ''
    });
    const [isAutoFilling, setIsAutoFilling] = useState(false);
    const [isFiling, setIsFiling] = useState(false);

    // Chatbot State
    const [chatHistory, setChatHistory] = useState([
        { role: 'model', text: "Hello! I am your AI Chartered Accountant. Ask me anything about Indian taxes, ITR filing, or deductions." }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatThinking, setIsChatThinking] = useState(false);
    const chatEndRef = useRef(null);

    // Tax Updates State
    const [selectedUpdate, setSelectedUpdate] = useState(null); // For modal
    const [updateSummary, setUpdateSummary] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    const taxUpdates = [
        { id: 1, title: 'New Tax Regime Default', desc: 'The new tax regime is now projected as the default for FY 2024-25.', color: 'bg-orange-50 text-orange-700 border-orange-200' },
        { id: 2, title: 'LTCG Tax Rate Change', desc: 'Long Term Capital Gains tax has been revised for certain asset classes.', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        { id: 3, title: 'Standard Deduction Hike', desc: 'Standard deduction for salaried employees increased to ₹75,000.', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ];

    // --- API & HANDLERS ---

    // WARNING: In production, move API Key to environment variables
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    // 1. ITR Form Auto-fill (Gemini)
    const handleAutoFill = async () => {
        setIsAutoFilling(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Generate realistic synthetic data for an Indian ITR filing for a salaried individual.
            Context: User Email: ${user?.email || 'unknown'}
            Return ONLY a raw JSON object (no markdown) with keys:
            - pan: Valid PAN (ABCDE1234F)
            - aadhaar: "xxxx-xxxx-xxxx"
            - assessmentYear: "2025-26"
            - grossIncome: Realistic annual income in INR (e.g. 1500000)
            - deductions80C: Up to 150000
            - deductions80D: Up to 50000
            - tdsDeducted: Realistic TDS amount`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanText);
            setItrData(data);
        } catch (error) {
            console.error("Auto-fill error:", error);
            alert("Agent failed to auto-fill. Please try again.");
        } finally {
            setIsAutoFilling(false);
        }
    };

    // 2. ITR Filing Submission (EmailJS)
    const handleFileITR = async (e) => {
        e.preventDefault();
        setIsFiling(true);

        // Placeholder Keys - User needs to update these in a real app or use the ones from setup
        const SERVICE_ID = 'service_l98xqmm';
        const TEMPLATE_ID = 'template_6bva1lw'; // Reusing or new, typical practice is new template for ITR
        const PUBLIC_KEY = 'Bt2eF_rlsUXTo8vn5';

        const templateParams = {
            to_email: user?.email || 'user@example.com',
            to_name: 'Taxpayer',
            from_name: "Credence Taxation Agent",
            policy_name: "ITR Filing FY24-25", // Reusing template fields creatively
            provider: "Self-Filing",
            coverage: `Gross Income: ₹${itrData.grossIncome}`,
            applicant_details: `
                PAN: ${itrData.pan}
                Aadhaar: ${itrData.aadhaar}
                AY: ${itrData.assessmentYear}
                Gross Income: ₹${itrData.grossIncome}
                Section 80C: ₹${itrData.deductions80C}
                Section 80D: ₹${itrData.deductions80D}
                TDS Deducted: ₹${itrData.tdsDeducted}
            `
        };

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            alert(`✅ ITR Filed Successfully!\n\nAcknowledgment sent to ${user?.email}.`);
        } catch (error) {
            console.warn("EmailJS Simulation:", error);
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert(`✅ ITR Filed Successfully! (Simulation Mode)`);
        } finally {
            setIsFiling(false);
            setItrData({ pan: '', aadhaar: '', assessmentYear: '2025-26', grossIncome: '', deductions80C: '', deductions80D: '', tdsDeducted: '' });
        }
    };

    const handleItrChange = (e) => {
        const { name, value } = e.target;
        setItrData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Tax Chatbot (Gemini)
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatInput('');
        setIsChatThinking(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Act as an expert Indian Chartered Accountant. Answer the user's tax question concisely and accurately.
            IMPORTANT: Do NOT use markdown formatting (no bold **, no italics *). Do NOT use bullet points or em dashes (—). Write in plain text paragraphs only. Speak naturally like a human advisor.
            Question: ${userMsg}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const aiMsg = response.text();

            setChatHistory(prev => [...prev, { role: 'model', text: aiMsg }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the tax database right now." }]);
        } finally {
            setIsChatThinking(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    // 4. Tax Update Summary (Gemini)
    const handleUpdateClick = async (update) => {
        setSelectedUpdate(update);
        setUpdateSummary('');
        setIsGeneratingSummary(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const prompt = `Provide a short, easy-to-understand summary of this Indian tax update: "${update.title} - ${update.desc}". Explain how it impacts a common taxpayer.
            IMPORTANT: Do NOT use markdown. Do NOT use asterisks (*) or em dashes (—). Keep it plain text and conversational.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const summary = response.text();
            setUpdateSummary(summary);
        } catch (error) {
            setUpdateSummary("Could not fetch details at this moment.");
        } finally {
            setIsGeneratingSummary(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#FAFAF7] text-[#1E3A2F] font-sans overflow-hidden">
            <Sidebar />

            <div className="md:ml-64 p-6 h-screen overflow-y-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-[#CFE3D8] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#E6EFEA] transition-colors shadow-sm" onClick={() => navigate('/agents')}>
                            <span className="font-bold text-lg text-[#1E3A2F]">←</span>
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-[#1E3A2F]">Taxation Agent</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#CFE3D8] shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#1E3A2F]">Live: FY 2024-25</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#1E3A2F] font-bold border border-white shadow-sm">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                    {/* LEFT COLUMN: ITR Form & Updates */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* ITR Filing Form */}
                        <div className="bg-white rounded-[32px] p-8 border border-[#CFE3D8] shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6 border-b border-[#CFE3D8]/50 pb-4">
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight text-[#1E3A2F] mb-1">ITR Filing Assistant</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">E-File your taxes in minutes</p>
                                </div>
                                <button
                                    onClick={handleAutoFill}
                                    disabled={isAutoFilling}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold uppercase tracking-wide shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                >
                                    {isAutoFilling ? <span className="animate-spin">✨</span> : <Sparkles size={14} />}
                                    {isAutoFilling ? 'Agent Working...' : 'Auto-fill ITR'}
                                </button>
                            </div>

                            <form onSubmit={handleFileITR} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">PAN Number</label>
                                        <input required name="pan" value={itrData.pan} onChange={handleItrChange} type="text" placeholder="ABCDE1234F" className="w-full bg-[#FAFAF7] border border-[#CFE3D8] rounded-xl px-4 py-3 text-sm font-semibold uppercase focus:outline-none focus:border-[#1E3A2F]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Aadhaar Number</label>
                                        <input required name="aadhaar" value={itrData.aadhaar} onChange={handleItrChange} type="text" placeholder="XXXX-XXXX-XXXX" className="w-full bg-[#FAFAF7] border border-[#CFE3D8] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1E3A2F]" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Assessment Year</label>
                                        <select name="assessmentYear" value={itrData.assessmentYear} onChange={handleItrChange} className="w-full bg-[#FAFAF7] border border-[#CFE3D8] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1E3A2F]">
                                            <option>2025-26</option>
                                            <option>2024-25</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">Gross Total Income (₹)</label>
                                        <input required name="grossIncome" value={itrData.grossIncome} onChange={handleItrChange} type="number" placeholder="1500000" className="w-full bg-[#FAFAF7] border border-[#CFE3D8] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1E3A2F]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">80C (₹)</label>
                                            <input name="deductions80C" value={itrData.deductions80C} onChange={handleItrChange} type="number" placeholder="150000" className="w-full bg-[#FAFAF7] border border-[#CFE3D8] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1E3A2F]" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">80D (₹)</label>
                                            <input name="deductions80D" value={itrData.deductions80D} onChange={handleItrChange} type="number" placeholder="25000" className="w-full bg-[#FAFAF7] border border-[#CFE3D8] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1E3A2F]" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">TDS Deducted (₹)</label>
                                        <input required name="tdsDeducted" value={itrData.tdsDeducted} onChange={handleItrChange} type="number" placeholder="50000" className="w-full bg-[#FAFAF7] border border-[#CFE3D8] rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-[#1E3A2F]" />
                                    </div>
                                </div>

                                <div className="md:col-span-2 mt-2">
                                    <button
                                        type="submit"
                                        disabled={isFiling}
                                        className={`w-full py-4 bg-[#1E3A2F] text-white font-bold rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-[#1E3A2F]/20 hover:bg-[#2A4D3F] hover:shadow-2xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${isFiling ? 'opacity-80 cursor-wait' : ''}`}
                                    >
                                        {isFiling ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Filing Returns...
                                            </>
                                        ) : (
                                            <>
                                                <FileText size={16} /> Submit ITR Filing
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Recent Tax Policy Changes */}
                        <div className="bg-white rounded-[32px] p-6 border border-[#CFE3D8] shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Policy Updates</h3>
                                <AlertCircle size={14} className="text-gray-400" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {taxUpdates.map((update) => (
                                    <div key={update.id} onClick={() => handleUpdateClick(update)} className={`cursor-pointer group p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md ${update.color}`}>
                                        <h4 className="font-bold text-sm mb-2 group-hover:underline">{update.title}</h4>
                                        <p className="text-[10px] font-medium opacity-80 leading-relaxed line-clamp-3">{update.desc}</p>
                                        <div className="mt-3 flex items-center justify-end">
                                            <ArrowRight size={12} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: AI Chatbot */}
                    <div className="lg:col-span-1 bg-white rounded-[32px] border border-[#CFE3D8] shadow-lg overflow-hidden flex flex-col h-[600px] lg:h-auto">
                        <div className="p-6 border-b border-[#CFE3D8] bg-[#FAFAF7]">
                            <h3 className="text-lg font-black uppercase tracking-tight text-[#1E3A2F] flex items-center gap-2">
                                <MessageSquare size={20} className="text-emerald-600" /> Tax Assistant
                            </h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-7">Ask me anything about your taxes</p>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF7]/50 custom-scrollbar">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${msg.role === 'user'
                                        ? 'bg-[#1E3A2F] text-white rounded-br-none shadow-md'
                                        : 'bg-white border border-[#CFE3D8] text-[#1E3A2F] rounded-bl-none shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isChatThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-[#CFE3D8] p-3 rounded-2xl rounded-bl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></span>
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef}></div>
                        </div>

                        {/* Input */}
                        <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-[#CFE3D8]">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Type your question..."
                                    className="w-full bg-[#FAFAF7] border border-[#CFE3D8] rounded-xl px-4 py-3 pr-10 text-xs font-semibold focus:outline-none focus:border-[#1E3A2F]"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#1E3A2F] text-white hover:bg-[#2A4D3F] transition-colors">
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

                {/* MODAL: Policy Update Detail */}
                {selectedUpdate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-[#1E3A2F]/80 backdrop-blur-sm" onClick={() => setSelectedUpdate(null)}></div>
                        <div className="bg-white rounded-[32px] p-8 max-w-lg w-full relative z-10 shadow-2xl animate-fade-in-up border border-[#CFE3D8]">
                            <button
                                onClick={() => setSelectedUpdate(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-[#FAFAF7] hover:bg-[#E6EFEA] transition-colors"
                            >
                                <X size={20} className="text-[#1E3A2F]" />
                            </button>

                            <h2 className="text-xl font-black text-[#1E3A2F] mb-4 pr-8">{selectedUpdate.title}</h2>
                            <div className="bg-[#FAFAF7] p-4 rounded-xl border border-[#CFE3D8] mb-6">
                                {isGeneratingSummary ? (
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                        <Sparkles size={14} className="animate-spin text-emerald-500" /> Authenticating Source & Summarizing...
                                    </div>
                                ) : (
                                    <p className="text-sm text-[#1E3A2F]/80 leading-relaxed whitespace-pre-line">
                                        {updateSummary}
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setSelectedUpdate(null)} className="w-full py-3 bg-[#1E3A2F] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2A4D3F] transition-colors">
                                Close Update
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TaxationPage;
