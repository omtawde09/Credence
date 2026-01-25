import React from 'react';
import { Star, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { tagColors } from '../data/advisorsData';

const AdvisorCard = ({ advisor, onViewProfile }) => {
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className={`relative backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 ${advisor.isCurrent
            ? 'bg-blue-50/40 ring-2 ring-blue-400/50 shadow-blue-500/20'
            : 'bg-white/30 hover:bg-white/50 shadow-xl'
            }`}>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            <div className="relative z-10">
                {/* Current Badge */}
                {advisor.isCurrent && (
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            Current Advisor
                        </span>
                    </div>
                )}

                {/* Advisor Header */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {getInitials(advisor.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{advisor.name}</h3>
                        <p className="text-xs text-slate-500 mb-2">{advisor.role}</p>

                        {/* Rating & Experience */}
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                <span className="font-bold text-slate-700">{advisor.rating}</span>
                            </div>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600">{advisor.experience} exp</span>
                        </div>
                    </div>
                </div>

                {/* Specialization Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {advisor.specializations.map((tag, index) => (
                        <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${tagColors[tag] || 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-slate-100">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Clients</p>
                        <div className="flex items-center gap-1">
                            <Users size={12} className="text-slate-400" />
                            <p className="text-sm font-bold text-slate-800">{advisor.clients}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">AUM</p>
                        <p className="text-sm font-bold text-slate-800">{advisor.aum}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Returns</p>
                        <div className="flex items-center gap-1">
                            <TrendingUp size={12} className="text-green-500" />
                            <p className="text-sm font-bold text-green-600">{advisor.performance}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {advisor.description}
                </p>

                {/* Action Button */}
                <button
                    onClick={() => onViewProfile && onViewProfile(advisor)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all backdrop-blur-sm ${advisor.isCurrent
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500'
                        : 'bg-slate-800/80 text-white hover:bg-slate-700/90 shadow-lg'
                        }`}
                >
                    {advisor.isCurrent ? 'View Profile' : 'Switch to Advisor'}
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default AdvisorCard;
