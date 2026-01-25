import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const events = [
        { day: 5, title: 'Rent Due', type: 'payment' },
        { day: 10, title: 'Insurance Premium', type: 'payment' },
        { day: 15, title: 'Salary Credit', type: 'income' },
        { day: 20, title: 'EMI Payment', type: 'payment' },
        { day: 25, title: 'Investment Review', type: 'meeting' },
    ];

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Sidebar />
            <div className="md:ml-64 p-8 pt-6 transition-all duration-300">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Calendar</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input type="text" placeholder="Search events" className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64" />
                        </div>
                        <button className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                            <div className="flex gap-2">
                                <button onClick={prevMonth} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100"><ChevronLeft size={18} /></button>
                                <button onClick={nextMonth} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100"><ChevronRight size={18} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-bold text-slate-500 py-2">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-12" />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const event = events.find(e => e.day === day);
                                return (
                                    <div key={day} className={`h-12 flex flex-col items-center justify-center rounded-xl text-sm ${event ? 'bg-blue-100 text-slate-800 font-bold' : 'hover:bg-slate-100'}`}>
                                        {day}
                                        {event && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-lg">
                        <h3 className="font-bold mb-4">Upcoming Events</h3>
                        <div className="space-y-3">
                            {events.map((event, i) => (
                                <div key={i} className="p-4 bg-slate-100/50 rounded-xl">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-sm">{event.title}</p>
                                            <p className="text-xs text-slate-500">{monthNames[currentDate.getMonth()]} {event.day}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${event.type === 'income' ? 'bg-blue-100 text-teal-600' : event.type === 'payment' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-600'}`}>
                                            {event.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
