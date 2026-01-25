import React, { useState } from 'react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';
import { Search, Bell, User, Lock, Bell as BellIcon, CreditCard, Globe, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const settingSections = [
        {
            title: 'Account',
            icon: User,
            items: [
                { label: 'Edit Profile', action: () => navigate('/account') },
                { label: 'Change Email', action: () => {} },
                { label: 'Verify Identity', action: () => {} },
            ]
        },
        {
            title: 'Security',
            icon: Lock,
            items: [
                { label: 'Change Password', action: () => {} },
                { label: 'Two-Factor Authentication', action: () => {} },
                { label: 'Login History', action: () => {} },
            ]
        },
        {
            title: 'Payment Methods',
            icon: CreditCard,
            items: [
                { label: 'Manage Cards', action: () => navigate('/credit') },
                { label: 'Bank Accounts', action: () => {} },
                { label: 'UPI Settings', action: () => {} },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-orange-50/30 text-green-800">
            <Sidebar />
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search settings" className="pl-10 pr-4 py-2 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-green-800 w-64" />
                        </div>
                        <button className="p-2 rounded-xl border border-orange-200 bg-white text-slate-500 hover:text-green-800">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {settingSections.map((section, i) => (
                            <div key={i} className="bg-white border border-orange-200 rounded-[32px] p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <section.icon size={24} className="text-green-800" />
                                    <h3 className="font-bold">{section.title}</h3>
                                </div>
                                <div className="space-y-2">
                                    {section.items.map((item, j) => (
                                        <button key={j} onClick={item.action} className="w-full flex justify-between items-center p-4 bg-orange-50/50 rounded-xl hover:bg-orange-50 transition-colors text-left">
                                            <span className="text-sm font-medium">{item.label}</span>
                                            <span className="text-slate-400">→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-orange-200 rounded-[32px] p-6 shadow-lg">
                            <h3 className="font-bold mb-4">Preferences</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-orange-50/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <BellIcon size={18} className="text-slate-500" />
                                        <span className="text-sm font-medium">Notifications</span>
                                    </div>
                                    <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-green-600' : 'bg-slate-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-orange-50/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Moon size={18} className="text-slate-500" />
                                        <span className="text-sm font-medium">Dark Mode</span>
                                    </div>
                                    <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-green-600' : 'bg-slate-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-orange-50/50 rounded-xl">
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
