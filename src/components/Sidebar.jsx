import React from 'react';
import useAuthStore from '../store/useAuthStore';
import useSidebarStore from '../store/useSidebarStore';
import {
    Home,
    User,
    Activity,
    CreditCard,
    Receipt,
    Settings,
    Calendar,
    HelpCircle,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const { activeTab, setActiveTab } = useSidebarStore();
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Home', icon: Home, path: '/dashboard' },
        { name: 'Account', icon: User, path: '/account' },
        { name: 'Activity', icon: Activity, path: '/activity' },
        { name: 'Cards', icon: CreditCard, path: '/credit' },
        { name: 'Agents', icon: Receipt, path: '/agents' },
        { name: 'Manage', icon: Settings, path: '/manage' },
        { name: 'Calendar', icon: Calendar, path: '/calendar' },
    ];

    const bottomItems = [
        { name: 'Help Center', icon: HelpCircle, path: '/help' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Helper to handle navigation and active tab
    const handleNav = (item) => {
        setActiveTab(item.name);
        if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col p-6 z-40 overflow-y-auto hidden md:flex">
            {/* 1. Logo */}
            <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate('/')}>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-800">CREDENCE</span>
            </div>

            {/* 2. Main Navigation */}
            <div className="space-y-1 mb-8">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNav(item)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
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

            {/* 3. Bottom Navigation */}
            <div className="space-y-1 mb-auto">
                {bottomItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.name;
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleNav(item)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="text-[13px] font-bold">{item.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-colors" onClick={handleLogout}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
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
