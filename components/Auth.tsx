
import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import { SycamoreLogo } from './SycamoreLogo';
import { ArrowRight, Loader2, UserPlus, KeyRound } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSignUp,
    handleLogin,
  } = useLogin(onLogin);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <div className="w-full max-w-md">
        <div className="glass-card border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center space-y-4">
            <SycamoreLogo size={64} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
              {isLogin ? 'Steward Login' : 'Create Account'}
            </h2>
            <p className="text-sm text-slate-500 font-medium text-center">Access the EnvirosAgro Planetary Registry.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <UserPlus className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-600" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Steward Email"
                required
                className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-600" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-600 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 disabled:bg-slate-700 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(16,185,129,0.4)] hover:shadow-emerald-400/50"
            >
              {loading ? <Loader2 className="animate-spin" /> : isLogin ? 'Login' : 'Sign Up'}
              {!loading && <ArrowRight size={20} />}
            </button>
            {error && <p className="text-rose-500 text-sm font-bold text-center pt-2">{error}</p>}
          </form>

          <div className="text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-slate-500 hover:text-emerald-400 font-bold text-sm transition-all duration-300">
              {isLogin ? 'Need an account? Create one now' : 'Already a steward? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
