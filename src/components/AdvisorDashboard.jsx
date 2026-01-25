import React, { useState } from 'react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';
import { Search, Bell, Users, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InvestmentExplainer from './InvestmentExplainer';
import AdvisorCompatibility from './AdvisorCompatibility';
import LifeEventAlert from './LifeEventAlert';
import RiskMismatchAlert from './RiskMismatchAlert';
import TransparencyDisclosure from './TransparencyDisclosure';
import ClientSummary from './ClientSummary';
import { mockInvestorProfile, mockAdvisorProfile, detectRiskMismatch } from '../data/investorProfile';

const AdvisorDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [selectedClient, setSelectedClient] = useState(mockInvestorProfile);
    const [activeTab, setActiveTab] = useState('overview');

    const clients = [
        { ...mockInvestorProfile, hasAlert: true },
        { id: 'INV-2025-002', name: 'Sneha Patel', email: 'sneha.p@example.com', aum: 2500000, riskProfile: { score: 4 }, hasAlert: false },
        { id: 'INV-2025-003', name: 'Vikram Reddy', email: 'vikram.r@example.com', aum: 800000, riskProfile: { score: 8 }, hasAlert: true },
    ];

    const mismatch = detectRiskMismatch(selectedClient);
    const pendingEvents = selectedClient.lifeEvents?.filter(e => e.pending) || [];

    return (
        <div className="min-h-screen bg-[#FAFAF7] text-[#1E3A2F]">
            <Sidebar />

            <div className="md:ml-64 p-6 h-screen overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-[#CFE3D8] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#E6EFEA] transition-colors shadow-sm" onClick={() => navigate('/agents')}>
                            <span className="font-bold text-lg text-[#1E3A2F]">←</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Advisor Dashboard</h1>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Intelligent Journey Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search clients..." className="pl-10 pr-4 py-2 rounded-xl border border-[#CFE3D8] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#1E3A2F] w-64" />
                        </div>
                        <button className="p-2 rounded-xl border border-[#CFE3D8] bg-white text-gray-500 hover:text-[#1E3A2F] relative">
                            <Bell size={18} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#1E3A2F] text-xs font-bold ring-2 ring-white">
                            {user?.email?.[0].toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[24px] p-4 border border-[#CFE3D8] shadow-sm mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Users size={16} className="text-[#1E3A2F]" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">My Clients</h3>
                            </div>
                            <div className="space-y-2">
                                {clients.map((client) => (
                                    <button
                                        key={client.id}
                                        onClick={() => setSelectedClient(client.id === mockInvestorProfile.id ? mockInvestorProfile : client)}
                                        className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${selectedClient.id === client.id ? 'bg-[#1E3A2F] text-white' : 'bg-[#FAFAF7] hover:bg-[#E6EFEA]'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedClient.id === client.id ? 'bg-white/20 text-white' : 'bg-[#E6EFEA] text-[#1E3A2F]'}`}>
                                                {client.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold">{client.name}</p>
                                                <p className={`text-[10px] ${selectedClient.id === client.id ? 'text-white/60' : 'text-gray-400'}`}>
                                                    ₹{((client.aum || client.currentPortfolio?.totalValue || 0) / 100000).toFixed(1)}L AUM
                                                </p>
                                            </div>
                                        </div>
                                        {client.hasAlert && (
                                            <AlertTriangle size={14} className={selectedClient.id === client.id ? 'text-amber-300' : 'text-amber-500'} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ClientSummary investor={selectedClient} advisor={mockAdvisorProfile} />
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex gap-2 mb-4">
                            {['overview', 'recommendations', 'disclosures'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-[#1E3A2F] text-white' : 'bg-white text-gray-500 border border-[#CFE3D8] hover:bg-[#E6EFEA]'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {(mismatch || pendingEvents.length > 0) && (
                                    <div className="lg:col-span-2">
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Active Alerts</p>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {selectedClient.lifeEvents && <LifeEventAlert investor={selectedClient} />}
                                            <RiskMismatchAlert investor={selectedClient} />
                                        </div>
                                    </div>
                                )}
                                
                                <AdvisorCompatibility investor={selectedClient} advisor={mockAdvisorProfile} />

                                <div className="bg-white rounded-[24px] p-6 border border-[#CFE3D8] shadow-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <button className="w-full p-4 bg-[#FAFAF7] rounded-xl flex items-center justify-between hover:bg-[#E6EFEA] transition-colors border border-[#CFE3D8]/50">
                                            <span className="text-sm font-medium">Schedule Review Meeting</span>
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </button>
                                        <button className="w-full p-4 bg-[#FAFAF7] rounded-xl flex items-center justify-between hover:bg-[#E6EFEA] transition-colors border border-[#CFE3D8]/50">
                                            <span className="text-sm font-medium">Generate Portfolio Report</span>
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </button>
                                        <button className="w-full p-4 bg-[#FAFAF7] rounded-xl flex items-center justify-between hover:bg-[#E6EFEA] transition-colors border border-[#CFE3D8]/50">
                                            <span className="text-sm font-medium">Initiate Rebalancing</span>
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'recommendations' && (
                            <InvestmentExplainer investorProfile={selectedClient} />
                        )}

                        {activeTab === 'disclosures' && (
                            <TransparencyDisclosure advisor={mockAdvisorProfile} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvisorDashboard;
