import React, { useState, useEffect } from 'react';
import { User, RefreshCw, Copy, Check, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { mockInvestorProfile, mockAdvisorProfile, generateClientSummary, detectRiskMismatch } from '../data/investorProfile';
import { advisorDashboardAssistant } from '../utils/aiAgentManager.js';

const ClientSummary = ({ investor, advisor }) => {
    const inv = investor || mockInvestorProfile;
    const adv = advisor || mockAdvisorProfile;
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [aiSummary, setAiSummary] = useState('');
    const [useAI, setUseAI] = useState(false);
    const [agentStatus, setAgentStatus] = useState({ enabled: false });

    // STEP 1: Generate deterministic summary (ALWAYS FIRST)
    const deterministicSummary = generateClientSummary(inv, adv);
    const mismatch = detectRiskMismatch(inv);
    const pendingEvents = inv.lifeEvents.filter(e => e.pending);

    useEffect(() => {
        const checkAgentStatus = async () => {
            try {
                const { getAIAgentSystemStatus } = await import('../utils/aiAgentManager.js');
                const status = getAIAgentSystemStatus();
                setAgentStatus(status);
            } catch (error) {
                console.warn('AI Agent Manager not available:', error);
            }
        };
        
        checkAgentStatus();
    }, []);

    // STEP 2: Generate AI-enhanced summary (ONLY after deterministic analysis)
    const generateAISummary = async () => {
        setRegenerating(true);
        try {
            // Prepare client data for AI agent
            const clientData = {
                name: inv.name,
                age: inv.age,
                occupation: inv.occupation,
                riskProfile: inv.riskProfile.stated,
                goals: inv.goals,
                currentPortfolio: inv.currentPortfolio,
                alerts: mismatch ? [{ type: 'Risk Mismatch', description: mismatch.explanation }] : [],
                pendingEvents: pendingEvents,
                lastReview: inv.lastReviewDate
            };

            // CRITICAL: Pass deterministic summary first (execution order enforcement)
            const result = await advisorDashboardAssistant.summarizeClient(
                { summary: deterministicSummary }, // Deterministic result REQUIRED first
                clientData,
                { confidence: 0.8 }
            );
            
            if (result.enhanced && result.content) {
                setAiSummary(result.content);
                setUseAI(true);
            } else {
                // Fall back to deterministic summary
                setAiSummary(deterministicSummary);
                setUseAI(false);
                console.log('AI enhancement not available:', result.reason);
            }
        } catch (error) {
            console.error("AI Summary generation error:", error);
            // Fallback to deterministic summary
            setAiSummary(deterministicSummary);
            setUseAI(false);
        } finally {
            setRegenerating(false);
        }
    };

    const currentSummary = useAI && aiSummary ? aiSummary : deterministicSummary;

    const handleCopy = () => {
        navigator.clipboard.writeText(currentSummary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerate = () => {
        if (useAI) {
            generateAISummary();
        } else {
            // First time - switch to AI
            generateAISummary();
        }
    };

    return (
        <div className="bg-white rounded-[24px] p-6 border border-[#CFE3D8] shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#E6EFEA] rounded-full flex items-center justify-center">
                        <FileText size={16} className="text-[#1E3A2F]" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Advisor Copilot Summary</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRegenerate}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[#CFE3D8] hover:bg-[#E6EFEA] transition-colors text-xs font-bold"
                        title={useAI ? "Regenerate AI Summary" : "Generate AI Summary"}
                        disabled={!agentStatus.systemEnabled && !useAI}
                    >
                        {regenerating ? (
                            <Sparkles size={14} className="text-emerald-500 animate-spin" />
                        ) : (
                            <RefreshCw size={14} className="text-[#1E3A2F]" />
                        )}
                        {agentStatus.systemEnabled ? (useAI ? 'AI' : 'AI+') : 'Rule'}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg border border-[#CFE3D8] hover:bg-[#E6EFEA] transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={14} className="text-teal-600" /> : <Copy size={14} className="text-[#1E3A2F]" />}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4 p-3 bg-[#FAFAF7] rounded-xl border border-[#CFE3D8]/50">
                <div className="w-10 h-10 rounded-full bg-[#1E3A2F] flex items-center justify-center text-white font-bold">
                    {inv.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <p className="font-bold text-[#1E3A2F]">{inv.name}</p>
                    <p className="text-xs text-gray-500">Client ID: {inv.id}</p>
                </div>
            </div>

            {(mismatch || pendingEvents.length > 0) && (
                <div className="flex gap-2 mb-4">
                    {mismatch && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-200">
                            <AlertCircle size={12} />
                            Risk Mismatch
                        </span>
                    )}
                    {pendingEvents.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full border border-amber-200">
                            <AlertCircle size={12} />
                            Life Event Pending
                        </span>
                    )}
                </div>
            )}

            <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#CFE3D8]/50 relative">
                {useAI && agentStatus.systemEnabled && (
                    <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                            <Sparkles size={10} />
                            AI Enhanced
                        </span>
                    </div>
                )}
                {!agentStatus.systemEnabled && (
                    <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                            Rule-Based
                        </span>
                    </div>
                )}
                <p className="text-sm text-[#1E3A2F]/80 leading-relaxed">{currentSummary}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#E6EFEA] rounded-xl text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Risk Score</p>
                    <p className="text-lg font-bold text-[#1E3A2F]">{inv.riskProfile.score}/10</p>
                </div>
                <div className="p-3 bg-[#E6EFEA] rounded-xl text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">AUM</p>
                    <p className="text-lg font-bold text-[#1E3A2F]">₹{(inv.currentPortfolio.totalValue / 100000).toFixed(1)}L</p>
                </div>
                <div className="p-3 bg-[#E6EFEA] rounded-xl text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Goals</p>
                    <p className="text-lg font-bold text-[#1E3A2F]">{inv.goals.length}</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#CFE3D8]">
                <p className="text-xs text-gray-400">
                    {useAI && agentStatus.systemEnabled ? 'AI-enhanced' : 'Rule-based'} summary for advisor briefing. 
                    {agentStatus.systemEnabled ? ' AI agents available.' : ' AI agents not configured.'} 
                    Last updated: {new Date().toLocaleDateString('en-IN')}
                </p>
            </div>
        </div>
    );
};

export default ClientSummary;
