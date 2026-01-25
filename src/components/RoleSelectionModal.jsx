"use client";

import React from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, ChevronRight, TrendingUp, Users2 } from "lucide-react";

const RoleSelectionModal = () => {
    const { isRoleSelectionOpen, setUserRole, user } = useAuthStore();
    const navigate = useNavigate();

    if (!isRoleSelectionOpen || !user) return null;

    const handleRoleSelection = (role) => {
        setUserRole(role);
        // Navigate based on role
        if (role === 'investor') {
            navigate('/dashboard');
        } else if (role === 'advisor') {
            navigate('/advisor-dashboard');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop - Cannot be dismissed */}
            <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-xl" />

            {/* Modal Card */}
            <div className="relative w-full max-w-[720px] bg-white rounded-[32px] shadow-2xl overflow-hidden p-10 animate-in fade-in zoom-in duration-300">

                <div className="text-center mb-8">
                    <div className="text-xl font-black tracking-tighter mb-2">CREDENCE</div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                        Welcome, {user?.name || user?.email?.split('@')[0]}!
                    </h2>
                    <p className="text-sm text-slate-600">
                        Choose how you'd like to use Credence today
                    </p>
                </div>

                {/* Role Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Investor Card */}
                    <button
                        onClick={() => handleRoleSelection('investor')}
                        className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-500 rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 active:scale-95"
                    >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="text-blue-600" size={24} />
                        </div>

                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <TrendingUp className="text-white" size={28} strokeWidth={2.5} />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                            I'm an Investor
                        </h3>

                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                            Manage your portfolio, track investments, get personalized recommendations, and access AI-powered financial agents.
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                Portfolio Dashboard
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                AI Financial Agents
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                Investment Recommendations
                            </div>
                        </div>
                    </button>

                    {/* Advisor Card */}
                    <button
                        onClick={() => handleRoleSelection('advisor')}
                        className="group relative bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 hover:border-violet-500 rounded-3xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1 active:scale-95"
                    >
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="text-violet-600" size={24} />
                        </div>

                        <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users2 className="text-white" size={28} strokeWidth={2.5} />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                            I'm an Advisor
                        </h3>

                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                            Manage client portfolios, access client management tools, track client activities, and provide professional advisory services.
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                                Client Management
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                                Advisor Dashboard
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                                Client Analytics
                            </div>
                        </div>
                    </button>

                </div>

                <p className="text-center text-xs text-slate-400 mt-8">
                    You can change your role anytime from Settings
                </p>
            </div>
        </div>
    );
};

export default RoleSelectionModal;
