import React, { useState, useEffect } from 'react';
import { Shield, Activity, GitFork, Wifi, ArrowUpRight, CheckCircle2, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

export const MetricsAtAGlance: React.FC = () => {
  const { theme } = useTheme();
  const isNova = theme === 'nova-crimson';

  const [ecgOffset, setEcgOffset] = useState(0);

  // Subtle animated heartbeat ECG wave
  useEffect(() => {
    const interval = setInterval(() => {
      setEcgOffset((prev) => (prev + 1) % 40);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full mt-6">
      {/* Top Health / Security Score Card (Mirrors screenshot Frame 2 & Frame 3: score indicator with status pill) */}
      <div className={`rounded-3xl p-5 sm:p-7 border relative overflow-hidden transition-all shadow-lg ${
        isNova
          ? 'bg-gradient-to-br from-[#2A0812] via-[#150A0E] to-[#0A0B0E] border-rose-900/40 shadow-rose-950/30'
          : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-md shadow-indigo-100/50'
      }`}>
        
        {/* Ambient glow overlays */}
        {isNova ? (
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-600/15 via-red-900/10 to-transparent blur-3xl pointer-events-none -z-0"></div>
        ) : (
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-200/25 via-pink-100/20 to-transparent blur-3xl pointer-events-none -z-0"></div>
        )}

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs ${
              isNova
                ? 'bg-rose-950/60 border-rose-800/50 text-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.3)]'
                : 'bg-indigo-50/90 border-indigo-100 text-indigo-600 shadow-sm shadow-indigo-100/50'
            }`}>
              <Shield className="w-8 h-8" />
            </div>

            <div>
              <span className={`text-xs font-bold uppercase tracking-wider block ${
                isNova ? 'text-rose-300/80' : 'text-slate-500'
              }`}>
                Security & Code Integrity Score
              </span>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  isNova ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  99
                </span>
                <span className={`text-lg font-bold ${isNova ? 'text-rose-300/50' : 'text-slate-400'}`}>
                  /100
                </span>
                <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isNova
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800/50 shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-2xs'
                }`}>
                  +3.20% Knox Hardened
                </span>
              </div>
            </div>
          </div>

          {/* Knox Key Enclave card banner */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
              isNova
                ? 'bg-gradient-to-r from-red-900/40 to-rose-950/30 border-rose-800/40'
                : 'bg-white/90 border-indigo-100/80 shadow-2xs'
            }`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isNova ? 'bg-rose-600 text-white' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs'
              }`}>
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-left font-mono">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isNova ? 'text-rose-300' : 'text-slate-400'}`}>
                  Knox Vault Enclave
                </p>
                <p className={`text-xs font-bold ${isNova ? 'text-white' : 'text-slate-900'}`}>
                  •••• 7714
                </p>
              </div>
            </div>

            <div className={`text-xs pl-2 ${isNova ? 'text-rose-200/70' : 'text-slate-600'}`}>
              <div className={`flex items-center gap-1.5 font-semibold ${isNova ? 'text-white' : 'text-slate-900'}`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${isNova ? 'text-rose-400' : 'text-emerald-500'}`} />
                <span>Knox TEE Verified</span>
              </div>
              <p className={`text-[11px] mt-0.5 ${isNova ? 'text-slate-400' : 'text-slate-400'}`}>
                StrongBox KeyStore • 0 CVEs
              </p>
            </div>
          </div>

        </div>

        <p className={`text-xs mt-4 pt-3 border-t ${
          isNova ? 'border-rose-950/60 text-rose-300/60' : 'border-indigo-50 text-slate-500'
        }`}>
          Ranked in top 1% for Android cryptographic implementations and hardware-backed biometric security.
        </p>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mt-8 mb-4 px-1">
        <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${
          isNova ? 'text-white' : 'text-[#0F172A]'
        }`}>
          Portfolio at a glance
        </h2>
        <span className={`text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
          isNova ? 'text-rose-400 hover:text-rose-300' : 'text-slate-500 hover:text-slate-800'
        }`}>
          Live Telemetry <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>

      {/* 2x2 Grid of Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Security Projects (Bar Chart with highlights) */}
        <div className={`rounded-3xl p-5 border transition-all flex flex-col justify-between group ${
          isNova
            ? 'bg-[#101117] border-rose-900/30 hover:border-rose-700/50 hover:shadow-lg hover:shadow-rose-950/30'
            : 'bg-white/85 backdrop-blur-xl border-white/90 hover:border-indigo-200/70 shadow-sm shadow-indigo-100/40 hover:shadow-md hover:shadow-indigo-100/50'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isNova ? 'text-white' : 'text-[#0F172A]'
              }`}>
                24+
              </span>
              <span className={`p-2 rounded-xl transition-colors ${
                isNova 
                  ? 'bg-rose-950/60 text-rose-400 group-hover:bg-rose-900/60' 
                  : 'bg-indigo-50/80 text-indigo-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
              }`}>
                <Shield className="w-4 h-4" />
              </span>
            </div>
            <p className={`text-xs font-medium mt-1 ${isNova ? 'text-slate-400' : 'text-slate-500'}`}>
              Security Projects
            </p>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-5">
            <div className="h-16 flex items-end justify-between gap-1.5 px-1">
              {[35, 60, 45, 85, 55, 95, 70, 40, 80].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-full transition-all duration-500 ${
                      i === 5 || i === 3 
                        ? (isNova 
                            ? 'bg-gradient-to-t from-red-600 to-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.5)]' 
                            : 'bg-gradient-to-t from-violet-600 to-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.4)]')
                        : (isNova ? 'bg-slate-800 group-hover:bg-slate-700' : 'bg-indigo-100 group-hover:bg-indigo-200/70')
                    }`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
              <span>Audited</span>
              <span className={isNova ? 'font-bold text-rose-400' : 'font-bold text-indigo-600'}>Sprint 10</span>
              <span>Production</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Apps (Heart rate ECG waveform) */}
        <div className={`rounded-3xl p-5 border transition-all flex flex-col justify-between group ${
          isNova
            ? 'bg-[#101117] border-rose-900/30 hover:border-rose-700/50 hover:shadow-lg hover:shadow-rose-950/30'
            : 'bg-white/85 backdrop-blur-xl border-white/90 hover:border-indigo-200/70 shadow-sm shadow-indigo-100/40 hover:shadow-md hover:shadow-indigo-100/50'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isNova ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  8
                </span>
                <span className="text-xs font-semibold text-slate-400">deployed</span>
              </div>
              <span className={`p-2 rounded-xl transition-colors ${
                isNova 
                  ? 'bg-rose-950/60 text-rose-400 group-hover:bg-rose-900/60' 
                  : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
              }`}>
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <p className={`text-xs font-medium mt-1 ${isNova ? 'text-slate-400' : 'text-slate-500'}`}>
              Active Apps & Microservices
            </p>
          </div>

          {/* ECG Pulse Waveform */}
          <div className="mt-5">
            <div className="h-16 w-full flex items-center justify-center overflow-hidden relative">
              <svg 
                className="w-full h-12 overflow-visible" 
                viewBox="0 0 200 60" 
                fill="none"
              >
                <path
                  d="M0 30 L40 30 L50 15 L60 48 L70 5 L80 40 L90 30 L130 30 L140 10 L150 50 L160 25 L170 30 L200 30"
                  stroke={isNova ? '#E11D48' : '#4F46E5'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle 
                  cx={70 + (ecgOffset * 1.5) % 100} 
                  cy={30} 
                  r="3.5" 
                  fill={isNova ? '#FF2D55' : '#8B5CF6'} 
                  className="animate-ping opacity-75"
                />
                <circle 
                  cx={70 + (ecgOffset * 1.5) % 100} 
                  cy={30} 
                  r="3" 
                  fill={isNova ? '#FF2D55' : '#8B5CF6'} 
                />
              </svg>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
              <span>99.98% Uptime</span>
              <span className={`font-semibold flex items-center gap-1 ${isNova ? 'text-rose-400' : 'text-emerald-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isNova ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]' : 'bg-emerald-500'}`}></span> Live
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Code Repositories */}
        <div className={`rounded-3xl p-5 border transition-all flex flex-col justify-between group ${
          isNova
            ? 'bg-[#101117] border-rose-900/30 hover:border-rose-700/50 hover:shadow-lg hover:shadow-rose-950/30'
            : 'bg-white/85 backdrop-blur-xl border-white/90 hover:border-indigo-200/70 shadow-sm shadow-indigo-100/40 hover:shadow-md hover:shadow-indigo-100/50'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isNova ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  142
                </span>
                <span className="text-xs font-semibold text-slate-400">repos</span>
              </div>
              <span className={`p-2 rounded-xl transition-colors ${
                isNova 
                  ? 'bg-rose-950/60 text-rose-400 group-hover:bg-rose-900/60' 
                  : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'
              }`}>
                <GitFork className="w-4 h-4" />
              </span>
            </div>
            <p className={`text-xs font-medium mt-1 ${isNova ? 'text-slate-400' : 'text-slate-500'}`}>
              Code Repositories
            </p>
          </div>

          {/* Bar metrics */}
          <div className="mt-5">
            <div className="h-16 flex items-end justify-between gap-2 px-1">
              {[
                { h: 75, label: 'Kotlin', color: isNova ? 'bg-rose-500' : 'bg-violet-600' },
                { h: 50, label: 'Rust', color: isNova ? 'bg-amber-500' : 'bg-amber-500' },
                { h: 65, label: 'TS', color: isNova ? 'bg-red-600' : 'bg-indigo-500' },
                { h: 35, label: 'C++', color: isNova ? 'bg-slate-600' : 'bg-slate-600' },
                { h: 80, label: 'Python', color: isNova ? 'bg-rose-700' : 'bg-pink-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    style={{ height: `${item.h}%` }}
                    className={`w-full rounded-full ${item.color} opacity-85 transition-all duration-300 group-hover:opacity-100`}
                  />
                  <span className="text-[9px] font-mono text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
              <span>Public: 48</span>
              <span>Private: 94</span>
            </div>
          </div>
        </div>

        {/* Card 4: DNS Latency */}
        <div className={`rounded-3xl p-5 border transition-all flex flex-col justify-between group ${
          isNova
            ? 'bg-[#101117] border-rose-900/30 hover:border-rose-700/50 hover:shadow-lg hover:shadow-rose-950/30'
            : 'bg-white/85 backdrop-blur-xl border-white/90 hover:border-indigo-200/70 shadow-sm shadow-indigo-100/40 hover:shadow-md hover:shadow-indigo-100/50'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isNova ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  14
                </span>
                <span className="text-xs font-semibold text-slate-400">ms ping</span>
              </div>
              <span className={`p-2 rounded-xl transition-colors ${
                isNova 
                  ? 'bg-rose-950/60 text-rose-400 group-hover:bg-rose-900/60' 
                  : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
              }`}>
                <Wifi className="w-4 h-4" />
              </span>
            </div>
            <p className={`text-xs font-medium mt-1 ${isNova ? 'text-slate-400' : 'text-slate-500'}`}>
              OEI DNS Anycast Latency
            </p>
          </div>

          {/* Smooth Sine Curve */}
          <div className="mt-5">
            <div className="h-16 w-full flex items-center justify-center relative">
              <svg 
                className="w-full h-12 overflow-visible" 
                viewBox="0 0 160 50" 
                fill="none"
              >
                <path
                  d="M0 38 Q 25 15, 50 32 T 100 24 T 130 18 T 160 30"
                  stroke={isNova ? '#E11D48' : '#6366F1'}
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle 
                  cx="100" 
                  cy="24" 
                  r="5" 
                  fill={isNova ? '#E11D48' : '#8B5CF6'} 
                  className="animate-pulse" 
                />
                <circle cx="100" cy="24" r="2.5" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
              <span>Zurich Node</span>
              <span className={isNova ? 'font-bold text-rose-400' : 'font-bold text-indigo-600'}>
                Zero DNS Leaks
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
