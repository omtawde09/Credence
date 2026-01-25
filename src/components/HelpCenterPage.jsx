import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, HelpCircle, MessageCircle, Book, Video, Mail } from 'lucide-react';

const HelpCenterPage = () => {
    const faqs = [
        { q: 'How do I connect my bank account?', a: 'Go to Settings > Connected Accounts and click Add Account to securely link your bank.' },
        { q: 'Is my data secure?', a: 'Yes, we use bank-level encryption and never store your login credentials.' },
        { q: 'How does the AI agent work?', a: 'Our AI monitors your cashflow patterns and automatically optimizes your savings and payments.' },
        { q: 'How do I update my profile?', a: 'Go to Account settings to update your personal information and preferences.' },
    ];

    const resources = [
        { title: 'Getting Started Guide', icon: Book, desc: 'Learn the basics of Credence' },
        { title: 'Video Tutorials', icon: Video, desc: 'Watch step-by-step tutorials' },
        { title: 'Contact Support', icon: Mail, desc: 'Get help from our team' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Sidebar />
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Help Center</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search help articles" className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64" />
                        </div>
                        <button className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {resources.map((res, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <res.icon size={32} className="text-slate-800 mb-4" />
                            <h3 className="font-bold mb-1">{res.title}</h3>
                            <p className="text-sm text-slate-500">{res.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <HelpCircle size={24} className="text-slate-800" />
                            <h3 className="font-bold">Frequently Asked Questions</h3>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group">
                                    <summary className="flex justify-between items-center cursor-pointer p-4 bg-slate-100/50 rounded-xl hover:bg-slate-100 font-medium text-sm">
                                        {faq.q}
                                        <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                                    </summary>
                                    <p className="p-4 text-sm text-slate-600">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800 text-white rounded-[32px] p-8 shadow-lg flex flex-col justify-center">
                        <MessageCircle size={48} className="mb-4" />
                        <h3 className="text-xl font-bold mb-2">Need more help?</h3>
                        <p className="text-slate-300 text-sm mb-6">Our support team is available 24/7 to assist you with any questions.</p>
                        <button className="px-6 py-3 bg-white text-slate-800 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors w-fit">
                            Start Live Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenterPage;
