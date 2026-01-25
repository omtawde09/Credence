import React, { useState } from 'react';
import { AlertCircle, ChevronRight, Calendar, RefreshCw, X, CheckCircle } from 'lucide-react';
import { mockInvestorProfile, lifeEventImpacts } from '../data/investorProfile';

const LifeEventAlert = ({ investor, onAcknowledge }) => {
    const inv = investor || mockInvestorProfile;
    const pendingEvents = inv.lifeEvents.filter(e => e.pending);
    const [expandedEvent, setExpandedEvent] = useState(null);
    const [acknowledged, setAcknowledged] = useState([]);

    if (pendingEvents.length === 0 && acknowledged.length === 0) {
        return null;
    }

    const handleAcknowledge = (event) => {
        setAcknowledged([...acknowledged, event.event]);
        if (onAcknowledge) onAcknowledge(event);
    };

    const activeEvents = pendingEvents.filter(e => !acknowledged.includes(e.event));

    if (activeEvents.length === 0) {
        return (
            <div className="bg-teal-50 rounded-[24px] p-4 border border-slate-200 flex items-center gap-3">
                <CheckCircle size={20} className="text-teal-600" />
                <p className="text-sm text-slate-700 font-medium">All life events have been reviewed. Your plan is up to date.</p>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 rounded-[24px] p-6 border border-amber-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
                    <AlertCircle size={16} className="text-amber-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-amber-800">Life Event Detected</h3>
                    <p className="text-xs text-amber-600">Your financial plan may need review</p>
                </div>
            </div>

            {activeEvents.map((event, idx) => {
                const impact = lifeEventImpacts[event.event] || lifeEventImpacts['Job Change'];
                const isExpanded = expandedEvent === event.event;

                return (
                    <div key={idx} className="mb-4 last:mb-0">
                        <button 
                            onClick={() => setExpandedEvent(isExpanded ? null : event.event)}
                            className="w-full p-4 bg-white rounded-xl border border-amber-200 flex items-center justify-between hover:bg-amber-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Calendar size={18} className="text-amber-600" />
                                <div className="text-left">
                                    <span className="font-bold text-[#1E3A2F] block">{event.event}</span>
                                    <span className="text-xs text-gray-500">{event.date}</span>
                                </div>
                            </div>
                            <ChevronRight size={18} className={`text-amber-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>

                        {isExpanded && (
                            <div className="mt-3 p-4 bg-white rounded-xl border border-[#CFE3D8] animate-fade-in">
                                <div className="mb-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Assumptions That May Change</p>
                                    <ul className="space-y-1">
                                        {impact.assumptions.map((a, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="text-amber-500">•</span> {a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Potential Impacts</p>
                                    <ul className="space-y-1">
                                        {impact.impacts.map((imp, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                                <span className="text-teal-500">•</span> {imp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Recommended Next Steps</p>
                                    <ul className="space-y-2">
                                        {impact.nextSteps.map((step, i) => (
                                            <li key={i} className="text-sm text-[#1E3A2F] flex items-start gap-2 p-2 bg-[#FAFAF7] rounded-lg">
                                                <RefreshCw size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleAcknowledge(event)}
                                        className="flex-1 py-3 bg-[#1E3A2F] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2A4D3F] transition-colors"
                                    >
                                        Mark as Reviewed
                                    </button>
                                    <button className="py-3 px-4 border border-[#1E3A2F] text-[#1E3A2F] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#E6EFEA] transition-colors">
                                        Schedule Meeting
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default LifeEventAlert;
