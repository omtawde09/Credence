import React from 'react';

const SuperMoneyCard = ({ name = "ARJUN SHARMA" }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent p-6">
            <div
                className="relative w-[500px] h-[300px] rounded-[32px] p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300 cursor-pointer"
                style={{
                    background: '#334155'
                }}
            >
                {/* Background Decorative Text */}
                <div className="absolute -right-4 -bottom-6 text-[160px] font-black text-white opacity-10 select-none leading-none tracking-tighter pointer-events-none">
                    SUPER
                </div>

                {/* Top Row: Logo and Chip/Contactless */}
                <div className="flex justify-between items-start z-10">
                    <div className="text-white leading-tight">
                        <p className="text-2xl font-extrabold tracking-tighter">secure.</p>
                        <p className="text-2xl font-extrabold tracking-tighter -mt-1">money</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Simulating the EMV Chip */}
                        <div className="w-14 h-10 bg-amber-400 rounded-md shadow-inner" />

                        {/* Contactless Icon (SVG) */}
                        <svg
                            className="w-8 h-8 text-white opacity-80"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Bottom Row: Partner Logo and Name */}
                <div className="flex justify-between items-end z-10">
                    <div className="flex items-center text-white">
                        <span className="text-2xl font-bold tracking-tight">partner</span>
                        <div className="ml-2 pl-2 border-l-2 border-white/50 py-1">
                            <span className="text-2xl font-light">bank</span>
                        </div>
                    </div>

                    <div className="text-white font-medium tracking-[0.2em] text-sm opacity-90 uppercase">
                        {name}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperMoneyCard;
