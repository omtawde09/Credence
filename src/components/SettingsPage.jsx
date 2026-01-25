import React, { useState } from 'react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import { Search, Bell, User, Lock, Bell as BellIcon, CreditCard, Globe, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const { user, userRole, setUserRole, logout } = useAuthStore();
    const { isDarkMode, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleRoleSwitch = (newRole) => {
        setUserRole(newRole);
        // Navigate to appropriate dashboard
        if (newRole === 'investor') {
            navigate('/dashboard');
        } else if (newRole === 'advisor') {
            navigate('/advisor-dashboard');
        }
    };

    const settingSections = [
        {
            title: 'Account',
            icon: User,
            items: [
                { label: 'Edit Profile', action: () => navigate('/account') },
                { label: 'Change Email', action: () => { } },
                { label: 'Verify Identity', action: () => { } },
            ]
        },
        {
            title: 'Security',
            icon: Lock,
            items: [
                { label: 'Change Password', action: () => { } },
                { label: 'Two-Factor Authentication', action: () => { } },
                { label: 'Login History', action: () => { } },
            ]
        },
        {
            title: 'Payment Methods',
            icon: CreditCard,
            items: [
                { label: 'Manage Cards', action: () => navigate('/credit') },
                { label: 'Bank Accounts', action: () => { } },
                { label: 'UPI Settings', action: () => { } },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-gray-100 transition-colors duration-300">
            <Sidebar />
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search settings" className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 dark:text-white dark:placeholder-slate-400" />
                        </div>
                        <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {settingSections.map((section, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[32px] p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <section.icon size={24} className="text-slate-800 dark:text-slate-100" />
                                    <h3 className="font-bold dark:text-white">{section.title}</h3>
                                </div>
                                <div className="space-y-2">
                                    {section.items.map((item, j) => (
                                        <button key={j} onClick={item.action} className="w-full flex justify-between items-center p-4 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left">
                                            <span className="text-sm font-medium dark:text-slate-200">{item.label}</span>
                                            <span className="text-slate-400">→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {/* Current Role Display & Switcher */}
                        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[32px] p-6 shadow-lg">
                            <h3 className="font-bold mb-4 dark:text-white">Account Role</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <User size={16} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-blue-300 uppercase font-bold tracking-wider">Current Role</p>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white capitalize">{userRole || 'Not Set'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">Switch to different role</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRoleSwitch('investor')}
                                            disabled={userRole === 'investor'}
                                            className={`flex-1 px-4 py-2 rounded-xl font-bold text-xs transition-all ${userRole === 'investor'
                                                ? 'bg-blue-600 text-white cursor-not-allowed'
                                                : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600'
                                                }`}
                                        >
                                            Investor
                                        </button>
                                        <button
                                            onClick={() => handleRoleSwitch('advisor')}
                                            disabled={userRole === 'advisor'}
                                            className={`flex-1 px-4 py-2 rounded-xl font-bold text-xs transition-all ${userRole === 'advisor'
                                                ? 'bg-violet-600 text-white cursor-not-allowed'
                                                : 'bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-600'
                                                }`}
                                        >
                                            Advisor
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-[32px] p-6 shadow-lg">
                            <h3 className="font-bold mb-4 dark:text-white">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <BellIcon size={18} className="text-slate-500 dark:text-slate-400" />
                                        <span className="text-sm font-medium dark:text-slate-200">Notifications</span>
                                    </div>
                                    <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Moon size={18} className="text-slate-500 dark:text-slate-400" />
                                        <span className="text-sm font-medium dark:text-slate-200">Dark Mode</span>
                                    </div>
                                    <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-100/50 dark:bg-slate-700/30 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Globe size={18} className="text-slate-500 dark:text-slate-400" />
                                        <span className="text-sm font-medium dark:text-slate-200">Language</span>
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">English</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
