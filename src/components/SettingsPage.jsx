import React, { useState } from 'react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';
import { Search, Bell, User, Lock, Bell as BellIcon, CreditCard, Globe, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const { user, userRole, setUserRole, logout } = useAuthStore();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

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
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Sidebar />
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search settings" className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64" />
                        </div>
                        <button className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {settingSections.map((section, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <section.icon size={24} className="text-slate-800" />
                                    <h3 className="font-bold">{section.title}</h3>
                                </div>
                                <div className="space-y-2">
                                    {section.items.map((item, j) => (
                                        <button key={j} onClick={item.action} className="w-full flex justify-between items-center p-4 bg-slate-100/50 rounded-xl hover:bg-slate-100 transition-colors text-left">
                                            <span className="text-sm font-medium">{item.label}</span>
                                            <span className="text-slate-400">→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {/* Current Role Display & Switcher */}
                        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg">
                            <h3 className="font-bold mb-4">Account Role</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <User size={16} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Current Role</p>
                                            <p className="text-sm font-bold text-slate-800 capitalize">{userRole || 'Not Set'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-xs text-slate-500 mb-3 font-medium">Switch to different role</p>
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

                        <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg">
                            <h3 className="font-bold mb-4">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-100/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <BellIcon size={18} className="text-slate-500" />
                                        <span className="text-sm font-medium">Notifications</span>
                                    </div>
                                    <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-100/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Moon size={18} className="text-slate-500" />
                                        <span className="text-sm font-medium">Dark Mode</span>
                                    </div>
                                    <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-100/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Globe size={18} className="text-slate-500" />
                                        <span className="text-sm font-medium">Language</span>
                                    </div>
                                    <span className="text-sm text-slate-500">English</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold hover:bg-red-100 transition-colors">
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
