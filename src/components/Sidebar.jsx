import React from 'react';
import useAuthStore from '../store/useAuthStore';
import useSidebarStore from '../store/useSidebarStore';
import {
    Home,
    User,
    Users,
    Target,
    Shield,
    Settings,
    HelpCircle,
    LogOut,
    ChevronRight,
    Briefcase,
    Calendar,
    Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { activeTab, setActiveTab } = useSidebarStore();
    const { user, userRole, logout } = useAuthStore();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Home', icon: Home, path: '/dashboard' },
        { name: 'Get Started', icon: Target, path: '/investor-onboarding', highlight: true },
        { name: 'My Account', icon: User, path: '/account' },
        { name: 'Calendar', icon: Calendar, path: '/calendar' },
        { name: 'Agents', icon: Bot, path: '/agents' },
    ];

    const advisorItems = [
        { name: 'Advisor Portal', icon: Briefcase, path: '/advisor-dashboard' },
        { name: 'Client Management', icon: Users, path: '/advisor-dashboard' },
    ];

    const bottomItems = [
        { name: 'Help Center', icon: HelpCircle, path: '/help' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleNav = (item) => {
        setActiveTab(item.name);
        if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col p-6 z-40 overflow-y-auto hidden md:flex">
            <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate('/')}>
                <div className="bg-slate-800 p-1.5 rounded-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-800">CREDENCE</span>
            </div>

            {/* Show Investor Section only for investors */}
            {userRole === 'investor' && (
                <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-2">Investor</p>
                    <div className="space-y-1 mb-6">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.name;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNav(item)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-slate-800 text-white shadow-lg shadow-blue-500/20'
                                        : item.highlight
                                            ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                        }`}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className={`text-[13px] font-bold ${isActive ? 'tracking-wide' : ''}`}>
                                        {item.name}
                                    </span>
                                    {item.highlight && !isActive && (
                                        <span className="ml-auto text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Show Advisor Section only for advisors */}
            {userRole === 'advisor' && (
                <>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-2">Advisor</p>
                    <div className="space-y-1 mb-8">
                        {advisorItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.name;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNav(item)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-slate-800 text-white shadow-lg shadow-blue-500/20'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                        }`}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className={`text-[13px] font-bold ${isActive ? 'tracking-wide' : ''}`}>
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Bottom items shown for all roles */}
            <div className="space-y-1 mb-auto">
                {bottomItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNav(item)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="text-[13px] font-bold">{item.name}</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors" onClick={handleLogout}>
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                    {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                        {user?.displayName || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate">
                        {user?.email || 'user@example.com'}
                    </p>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
            </div>
        </aside>
    );
};

export default Sidebar;
