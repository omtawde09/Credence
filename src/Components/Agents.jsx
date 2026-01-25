import React from 'react';
import useAuthStore from '../store/useAuthStore';
import Sidebar from './Sidebar';
import { Search, Bell, Shield, TrendingUp, CloudRain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Agents = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FAFAF7] text-[#1E3A2F]">
            <Sidebar />

            {/* Main Content Wrapper - Offset by Sidebar width */}
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                {/* Header (Consistent with Dashboard) */}
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-2xl font-bold">Agents</h2>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">Autonomous Financial Managers</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search agents..."
                                className="pl-10 pr-4 py-2 rounded-xl border border-[#CFE3D8] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A2F] w-64"
                            />
                        </div>

                        <button className="p-2 rounded-xl border border-[#CFE3D8] bg-white text-gray-500 hover:text-[#1E3A2F]">
                            <Bell size={18} />
                        </button>

                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#1E3A2F] text-xs font-bold ring-2 ring-white">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Main Content Area - Grid Layout */}
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* CARD 1: POLICY AGENT (Based on Sales Statistics dark card) */}
                    <div
                        onClick={() => navigate('/policy-agent')}
                        className="bg-[#1E3A2F] text-white rounded-[32px] p-8 aspect-square flex flex-col justify-between shadow-2xl shadow-emerald-900/20 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Policy Agent</h3>
                                <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Active Shield</p>
                            </div>
                            <div className="bg-white/10 p-2 rounded-full backdrop-blur-md">
                                <Shield className="text-emerald-400" size={20} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black tracking-tighter">98%</span>
                                <span className="text-emerald-400 text-sm font-bold mb-1.5">Coverage</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[98%] bg-emerald-500 rounded-full" />
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed">
                                Automatically renegotiating 2 outdated policies. Expected savings: ₹12k/yr.
                            </p>
                        </div>
                    </div>

                    {/* CARD 2: TAXATION AGENT (Based on Current Balance card) */}
                    <div
                        onClick={() => navigate('/taxation-agent')}
                        className="bg-[#E6EFEA] text-[#1E3A2F] rounded-[32px] p-8 aspect-square flex flex-col justify-between border border-[#CFE3D8] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Taxation Agent</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Fiscal Optimizer</p>
                            </div>
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <TrendingUp className="text-[#1E3A2F]" size={20} />
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1 my-4 relative">
                            {/* Semi-Circle Progress Placeholder */}
                            <div className="w-32 h-16 border-t-8 border-l-8 border-r-8 border-[#1E3A2F] rounded-t-full relative flex items-end justify-center">
                                <span className="mb-2 text-xl font-bold">₹15k</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60">Tax Saved YTD</span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold bg-white/50 p-3 rounded-2xl backdrop-blur-sm">
                            <span className="uppercase tracking-widest opacity-60">Next Filing</span>
                            <span>14 Days</span>
                        </div>
                    </div>

                    {/* CARD 3: MONEY WEATHER (Based on Market Forecast card) */}
                    <div className="bg-white text-[#1E3A2F] rounded-[32px] p-8 aspect-square flex flex-col justify-between border border-[#CFE3D8] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Money Weather™</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Liquidity Forecast</p>
                            </div>
                            <div className="bg-[#FAFAF7] p-2 rounded-full border border-[#CFE3D8]">
                                <CloudRain className="text-blue-500" size={20} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Key Metric 1 */}
                            <div className="bg-[#FAFAF7] p-4 rounded-2xl border border-[#CFE3D8]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Storm Probability</span>
                                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">HIGH</span>
                                </div>
                                <div className="text-2xl font-black">85%</div>
                            </div>

                            {/* Key Metric 2 */}
                            <div className="bg-[#1E3A2F] p-4 rounded-2xl text-white">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Buffer Action</span>
                                </div>
                                <div className="text-sm font-medium leading-snug">
                                    Auto-transferring ₹5,000 to safety net.
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Agents;
