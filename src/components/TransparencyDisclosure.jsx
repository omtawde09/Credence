import React, { useState } from 'react';
import { FileText, DollarSign, AlertCircle, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { mockAdvisorProfile } from '../data/investorProfile';

const TransparencyDisclosure = ({ advisor }) => {
    const adv = advisor || mockAdvisorProfile;
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-[24px] p-6 border border-[#CFE3D8] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#E6EFEA] rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-[#1E3A2F]" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Transparency & Disclosures</h3>
            </div>

            <div className="space-y-3">
                <div className="p-4 bg-[#FAFAF7] rounded-xl border border-[#CFE3D8]/50">
                    <div className="flex items-start gap-3">
                        <DollarSign size={18} className="text-[#1E3A2F] mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-[#1E3A2F] mb-2">Compensation Model</p>
                            <p className="text-sm text-gray-600 mb-2">{adv.compensation.model}</p>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Advisory Fee: {adv.compensation.advisoryFee}</li>
                                <li>• Trail Commission: {adv.compensation.trailCommission}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                        <Shield size={18} className="text-blue-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-blue-800 mb-2">Fee Impact Explanation</p>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                For an investment of ₹10,00,000, the annual advisory fee would be approximately ₹7,500. 
                                Trail commissions are paid by mutual fund houses from their expense ratio and do not 
                                increase your cost. Your effective expense ratio remains unchanged.
                            </p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="w-full p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between hover:bg-amber-100 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <AlertCircle size={18} className="text-amber-600" />
                        <span className="text-sm font-bold text-amber-800">Conflict of Interest Disclosure</span>
                    </div>
                    {expanded ? <ChevronUp size={16} className="text-amber-600" /> : <ChevronDown size={16} className="text-amber-600" />}
                </button>

                {expanded && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{adv.conflictDisclosure}</p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Regulatory Statement</p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                This disclosure is provided in compliance with SEBI (Investment Advisers) Regulations, 2013 
                                and subsequent amendments. The advisor is registered with SEBI and AMFI. Investments in 
                                securities market are subject to market risks. Read all related documents carefully before 
                                investing. Past performance is not indicative of future returns.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#CFE3D8] flex items-center gap-2 text-xs text-gray-400">
                <Shield size={12} />
                <span>SEBI Registered Investment Advisor | AMFI Certified</span>
            </div>
        </div>
    );
};

export default TransparencyDisclosure;
