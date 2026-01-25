import React from 'react';
import Sidebar from './Sidebar';
import useAuthStore from '../store/useAuthStore';
import { Search, Bell, User, Mail, Phone, MapPin, Shield } from 'lucide-react';

const AccountPage = () => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Sidebar />
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Account</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64" />
                        </div>
                        <button className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white border border-slate-200 rounded-[32px] p-8 shadow-lg">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{user?.name || user?.email?.split('@')[0] || 'User'}</h3>
                                <p className="text-slate-500 text-sm">{user?.email || 'user@example.com'}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-slate-800 text-xs font-bold rounded-full">Premium Member</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-100/50 rounded-xl">
                                <Mail size={20} className="text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                                    <p className="font-medium">{user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-100/50 rounded-xl">
                                <Phone size={20} className="text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                                    <p className="font-medium">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-100/50 rounded-xl">
                                <MapPin size={20} className="text-slate-500" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Location</p>
                                    <p className="font-medium">Mumbai, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield size={24} className="text-slate-800" />
                            <h3 className="font-bold">Security</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-teal-50 rounded-xl">
                                <span className="text-sm font-medium">Two-Factor Auth</span>
                                <span className="text-xs text-teal-600 font-bold">Enabled</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-100 rounded-xl">
                                <span className="text-sm font-medium">Last Login</span>
                                <span className="text-xs text-slate-500">Today, 10:30 AM</span>
                            </div>
                            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                                Change Password
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountPage;
