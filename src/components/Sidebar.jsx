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
        { name: 'Advisors', icon: Users, path: '/advisors' },
        { name: 'Portfolio Manager', icon: Briefcase, path: '/portfolio-manager' },
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
        <aside className="w-64 h-screen fixed left-0 top-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-r border-white/50 dark:border-white/10 flex flex-col p-6 z-40 overflow-y-auto hidden md:flex shadow-2xl transition-colors duration-300">
            <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate('/')}>
                <div className="bg-slate-800 dark:bg-blue-600 p-1.5 rounded-lg transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-800 dark:text-white transition-colors">CREDENCE</span>
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
                                        ? 'bg-slate-800/90 dark:bg-blue-600 text-white shadow-lg shadow-blue-500/20 backdrop-blur-sm'
                                        : item.highlight
                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/50'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
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
                                ? 'bg-slate-800 text-white dark:bg-blue-600'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="text-[13px] font-bold">{item.name}</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors" onClick={handleLogout}>
                <div className="w-8 h-8 rounded-full bg-slate-700 dark:bg-slate-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                        {user?.displayName || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || 'user@example.com'}
                    </p>
                </div>
                <ChevronRight size={14} className="text-slate-400" />
            </div>
        </aside>
    );
};

export default Sidebar;
