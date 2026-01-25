import React, { useState } from 'react';
import { User, RefreshCw, Copy, Check, FileText, AlertCircle } from 'lucide-react';
import { mockInvestorProfile, mockAdvisorProfile, generateClientSummary, detectRiskMismatch } from '../data/investorProfile';

const ClientSummary = ({ investor, advisor }) => {
    const inv = investor || mockInvestorProfile;
    const adv = advisor || mockAdvisorProfile;
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);

    const summary = generateClientSummary(inv, adv);
    const mismatch = detectRiskMismatch(inv);
    const pendingEvents = inv.lifeEvents.filter(e => e.pending);

    const handleCopy = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerate = () => {
        setRegenerating(true);
        setTimeout(() => setRegenerating(false), 1000);
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
                        className="p-2 rounded-lg border border-[#CFE3D8] hover:bg-[#E6EFEA] transition-colors"
                        title="Regenerate"
                    >
                        <RefreshCw size={14} className={`text-[#1E3A2F] ${regenerating ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                        onClick={handleCopy}
                        className="p-2 rounded-lg border border-[#CFE3D8] hover:bg-[#E6EFEA] transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-[#1E3A2F]" />}
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

            <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#CFE3D8]/50">
                <p className="text-sm text-[#1E3A2F]/80 leading-relaxed">{summary}</p>
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
                    Auto-generated summary for advisor briefing. Last updated: {new Date().toLocaleDateString('en-IN')}
                </p>
            </div>
        </div>
    );
};

export default ClientSummary;
