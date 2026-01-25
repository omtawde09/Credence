import React from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const { openLogin, openSignUp, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/dashboard' || location.pathname === '/agents' || location.pathname === '/policy-agent' || location.pathname === '/taxation-agent') return null;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-14 bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-full flex items-center justify-between px-8 z-50 shadow-lg shadow-slate-900/5">
      <div className="text-lg font-black tracking-tighter text-slate-800 cursor-pointer" onClick={() => navigate('/')}>
        CREDENCE
      </div>

      {/* Public Links - Hidden if logged in */}
      {!user && (
        <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <span>Forecast</span>
          <span>Security</span>
          <span>Ledger</span>
        </div>
      )}

      {/* Auth Controls */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="hidden md:block text-right mr-2">
              <div className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Active Agent</div>
              <div className="text-[10px] font-bold text-slate-800">{user.email?.split('@')[0]}</div>
            </div>

            <button onClick={() => navigate('/dashboard')} className="bg-slate-800 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-blue-500/25 active:scale-95 transition-all">Dashboard</button>

            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={openLogin} className="bg-slate-800 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-blue-500/25 active:scale-95 transition-all">Login</button>
            <button onClick={openSignUp} className="bg-slate-800 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-blue-500/25 active:scale-95 transition-all">Sign Up</button>
          </>
        )}
      </div>

      {!user && (
        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px] cursor-pointer shadow-lg shadow-blue-500/25">
          ↗
        </div>
      )}
    </nav>
  );
};

export default NavBar;
