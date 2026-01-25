import React from 'react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';
import { Search, Bell } from 'lucide-react';
import AdvisorCard from './AdvisorCard';
import { advisorsData } from '../data/advisorsData';

const AdvisorsPage = () => {
    const { user } = useAuthStore();

    const currentAdvisor = advisorsData.find(a => a.isCurrent);
    const otherAdvisors = advisorsData.filter(a => !a.isCurrent);

    return (
        <div className="min-h-screen text-slate-800">
            <Sidebar />

            {/* Main Content Wrapper - Offset by Sidebar width */}
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold">Your Advisors</h2>
                        <p className="text-sm text-slate-500 mt-1">Connect with expert financial advisors</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>

                        <button className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-blue-600">
                            <Bell size={18} />
                        </button>

                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main>
                    {/* Current Advisor Section */}
                    <div className="mb-12">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Current Advisor</h3>
                        <div className="max-w-md">
                            <AdvisorCard
                                advisor={currentAdvisor}
                                onViewProfile={(advisor) => console.log('View profile', advisor)}
                            />
                        </div>
                    </div>

                    {/* Other Available Advisors */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Other Available Advisors</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherAdvisors.map((advisor) => (
                                <AdvisorCard
                                    key={advisor.id}
                                    advisor={advisor}
                                    onViewProfile={(advisor) => console.log('Switch to', advisor)}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdvisorsPage;
