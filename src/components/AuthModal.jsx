"use client";

import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const AuthModal = () => {
  const { isLoginOpen, isSignUpOpen, closeModals, openSignUp, openLogin, loginWithGoogle, login, signup, loading, error } = useAuthStore();
  const navigate = useNavigate();

  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoginOpen && !isSignUpOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginOpen) {
      await login(email, password);
    } else {
      await signup(email, password);
    }
    // Navigate to dashboard to show role selection modal (it's in Layout)
    navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    // Navigate to dashboard to show role selection modal (it's in Layout)
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-800/20 backdrop-blur-xl transition-opacity"
        onClick={closeModals}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] shadow-2xl overflow-hidden p-8 transition-all scale-100 animate-in fade-in zoom-in duration-300 ring-1 ring-white/50">
        <button onClick={closeModals} className="absolute top-6 right-6 text-slate-500 hover:text-slate-800">
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="text-xl font-black tracking-tighter mb-2">CREDENCE</div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isLoginOpen ? "Welcome Back" : "Start Earning"}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {isLoginOpen ? "Secure your agentic capital" : "Create your autonomous financial ledger"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-3.5 rounded-2xl font-bold text-sm text-slate-800 hover:bg-slate-100/50 transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow h-[1px] bg-slate-200" />
          <span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">or email</span>
          <div className="flex-grow h-[1px] bg-slate-200" />
        </div>

        {/* Form Fields */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Work Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/50 border border-white/40 px-5 py-3.5 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/80 transition-all font-medium"
          />

          {/* PASSWORD INPUT WITH EYE BUTTON */}
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/50 border border-white/40 px-5 py-3.5 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white/80 transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
            >
              {showPassword ? (
                /* Eye Off Icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                /* Eye Icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : (isLoginOpen ? "Login to Dashboard" : "Create Free Account")}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-8">
          {isLoginOpen ? "New to Credence?" : "Already have an account?"}
          <button
            onClick={isLoginOpen ? openSignUp : openLogin}
            className="ml-2 font-bold text-slate-800 hover:underline"
          >
            {isLoginOpen ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;