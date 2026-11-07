import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  Search, 
  Bell, 
  Smartphone,
  Lock,
  Cpu,
  Flame,
  SunMedium,
  User,
  Image as ImageIcon,
  CheckCircle2,
  MapPin,
  Briefcase,
  LogIn,
  LogOut
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderHeroProps {
  onOpenAi: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const HeaderHero: React.FC<HeaderHeroProps> = ({ onOpenAi, onNavigateSection }) => {
  const { theme, toggleTheme } = useTheme();
  const isAura = theme === 'aura-light';
  const { user, signInWithGoogle, logout, isAdmin, isSigningIn } = useAuth();

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // User uploaded verified profile portraits
  const profilePhotos = [
    {
      url: '/assets/aistudio/Picsart_26-10-30_21-28-35-190_c13026d2.jpg',
      title: 'Executive Portrait',
      caption: 'Three-piece tailored suit, principal architecture posture'
    },
    {
      url: '/assets/aistudio/file_0000000012288211b2448abce1ed5a5e_1__64e77f49.png',
      title: 'Editorial Signature Portrait',
      caption: 'Dark attire with authentic autograph signature watermark'
    }
  ];

  const currentPhoto = profilePhotos[activePhotoIdx];

  const copyEmail = () => {
    navigator.clipboard.writeText('contact.elimarath@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const triggerNotification = () => {
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 3500);
  };

  return (
    <header className="relative w-full pt-6 pb-6">
      
      {/* Top Website Navigation Bar */}
      <div className={`flex items-center justify-between pb-6 border-b transition-colors ${
        isAura ? 'border-slate-200/80' : 'border-rose-950/50'
      }`}>
        <div className="flex items-center gap-4">
          
          {/* Avatar with live status & click-to-switch photo */}
          <div 
            onClick={() => setActivePhotoIdx((prev) => (prev + 1) % profilePhotos.length)}
            className="relative cursor-pointer group"
            title="Click to toggle profile portrait"
          >
            <div className={`w-14 h-14 rounded-2xl p-0.5 shadow-md transition-all duration-300 group-hover:scale-105 ${
              isAura 
                ? 'bg-gradient-to-tr from-violet-500 via-pink-400 to-indigo-400 shadow-indigo-100' 
                : 'bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-rose-950/60'
            }`}>
              <img 
                src={currentPhoto.url} 
                alt="Omar El Imarath" 
                className="w-full h-full object-cover rounded-[14px] object-top"
              />
            </div>
            
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 rounded-full ${
              isAura 
                ? 'bg-emerald-500 border-white shadow-xs' 
                : 'bg-rose-500 border-[#07080B] shadow-[0_0_8px_#f43f5e]'
            }`}></span>

            {/* Micro photo switch badge */}
            <span className="absolute -top-1 -right-1 p-0.5 rounded-full bg-white/90 text-slate-700 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon className="w-3 h-3" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-extrabold tracking-tight ${
                isAura ? 'text-slate-900' : 'text-white'
              }`}>
                Omar El Imarath
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                isAura 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200/70' 
                  : 'bg-rose-950/60 text-rose-300 border-rose-800/40'
              }`}>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                VERIFIED SPECIALIST
              </span>
            </div>

            <div className={`text-xs font-semibold flex items-center gap-3 mt-1 ${
              isAura ? 'text-slate-500' : 'text-rose-200/70'
            }`}>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> Zurich / Remote
              </span>
              <span>•</span>
              <a 
                href="https://oeielite.dpdns.org" 
                target="_blank" 
                rel="noreferrer" 
                className={`font-mono text-xs flex items-center gap-1 transition-colors ${
                  isAura ? 'text-indigo-600 hover:text-indigo-800' : 'text-rose-400 hover:text-rose-300'
                }`}
              >
                oeielite.dpdns.org
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            </div>
          </div>
        </div>

        {/* Right utility buttons: Theme Switcher, Google Auth, Search, Notifications */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Firebase Google Auth Button */}
          {user ? (
            <div className={`flex items-center gap-2 p-1 pl-2.5 rounded-2xl border transition-all ${
              isAura ? 'bg-white/90 border-slate-200/90 shadow-2xs' : 'bg-[#14151E] border-rose-900/40'
            }`}>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-indigo-500" />
              )}
              <span className="text-xs font-bold max-w-[90px] truncate hidden md:inline">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              {isAdmin && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 hidden sm:inline">
                  ADMIN
                </span>
              )}
              <button
                onClick={logout}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
                title="Sign out of Firebase"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              disabled={isSigningIn}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs active:scale-95 border disabled:opacity-60 disabled:cursor-not-allowed ${
                isAura
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-indigo-200 border-transparent hover:brightness-110'
                  : 'bg-rose-950/70 border-rose-800/60 text-rose-200 hover:bg-rose-900/60'
              }`}
              title="Sign in with Google (Firebase Auth)"
            >
              <LogIn className={`w-3.5 h-3.5 ${isSigningIn ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSigningIn ? 'Signing In...' : 'Sign In'}</span>
            </button>
          )}

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border shadow-xs transition-all active:scale-95 ${
              isAura
                ? 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
                : 'bg-rose-950/40 text-rose-300 border-rose-800/50 hover:bg-rose-900/40 shadow-[0_0_15px_rgba(225,29,72,0.2)]'
            }`}
            title="Toggle between Aura Light and Nova Dark"
          >
            {isAura ? (
              <>
                <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Aura Light</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                <span className="hidden sm:inline">Nova Dark</span>
              </>
            )}
          </button>

          {/* Search Button */}
          <button 
            onClick={() => onNavigateSection('showcase')}
            className={`w-10 h-10 rounded-2xl border shadow-xs flex items-center justify-center transition-colors ${
              isAura
                ? 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'bg-[#12131A] border-rose-900/30 text-slate-300 hover:text-white hover:border-rose-700/50'
            }`}
            title="Search projects & source code"
          >
            <Search className="w-4 h-4" />
          </button>
          
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={triggerNotification}
              className={`w-10 h-10 rounded-2xl border shadow-xs flex items-center justify-center transition-colors relative ${
                isAura
                  ? 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  : 'bg-[#12131A] border-rose-900/30 text-slate-300 hover:text-white hover:border-rose-700/50'
              }`}
              title="System Alerts & Status"
            >
              <Bell className="w-4 h-4" />
              <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full animate-pulse ${
                isAura ? 'bg-indigo-600' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
              }`}></span>
            </button>

            {showNotificationToast && (
              <div className={`absolute right-0 top-12 w-72 rounded-2xl shadow-2xl border p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
                isAura 
                  ? 'bg-white border-slate-200 text-slate-900' 
                  : 'bg-[#14151D] border-rose-900/50 text-white'
              }`}>
                <div className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isAura ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-950/80 text-rose-400'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Knox TEE Attestation Passed</p>
                    <p className={`text-[11px] mt-0.5 ${isAura ? 'text-slate-500' : 'text-slate-400'}`}>
                      WireGuard node online (ping: 14ms). 0 CVE vulnerabilities detected.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Website Portfolio Hero Section (Combines Editorial Portraits + Bio + Quick Action Hub) */}
      <div className={`mt-8 rounded-3xl p-6 sm:p-10 border transition-all ${
        isAura 
          ? 'glass-panel-aura' 
          : 'bg-gradient-to-br from-[#24060E] via-[#14080D] to-[#0A0B0E] border-rose-900/40 shadow-xl'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline, Bio & Primary CTAs (7 cols) */}
          <div className="lg:col-span-7">
            
            {/* Active Status Pill */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 border ${
              isAura
                ? 'bg-gradient-to-r from-violet-100 via-pink-50 to-indigo-100 border-indigo-200/80 text-indigo-900'
                : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                isAura ? 'bg-indigo-600' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
              }`}></span>
              Active Developer & Principal Mobile Security Specialist
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Hello, I'm{' '}
              <span className={
                isAura 
                  ? 'bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-800 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent'
              }>
                Omar El Imarath
              </span>
            </h1>
            
            <p className={`mt-3 text-base sm:text-lg leading-relaxed max-w-xl ${
              isAura ? 'text-slate-600' : 'text-rose-100/70'
            }`}>
              Architecting zero-trust mobile security, Samsung Knox hardware enclaves, 
              FIDO2 passwordless passkeys, and sovereign privacy infrastructure for high-assurance Android platforms.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={copyEmail}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all active:scale-[0.98] ${
                  isAura
                    ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'
                    : 'bg-[#12131A] text-slate-200 border-rose-900/40 hover:border-rose-700/60'
                }`}
              >
                {copiedEmail ? (
                  <>
                    <Check className={`w-4 h-4 ${isAura ? 'text-emerald-600' : 'text-rose-400'}`} />
                    <span className={isAura ? 'text-emerald-700' : 'text-rose-300'}>Copied Email Address</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>contact.elimarath@gmail.com</span>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  </>
                )}
              </button>

              <button
                onClick={onOpenAi}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all active:scale-[0.98] group ${
                  isAura
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-105 shadow-indigo-300/40'
                    : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 shadow-rose-950/60 hover:brightness-110'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Ask Omar's AI</span>
              </button>

              <button
                onClick={() => setShowPhotoModal(true)}
                className={`inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all active:scale-[0.98] ${
                  isAura
                    ? 'bg-indigo-50/80 hover:bg-indigo-100/80 text-indigo-700 border-indigo-200/80'
                    : 'bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 border-rose-800/40'
                }`}
              >
                <User className="w-4 h-4" />
                <span>View Portraits</span>
              </button>
            </div>

            {/* Competency Badges */}
            <div className="mt-8 flex flex-wrap gap-2 pt-2 border-t border-slate-200/50">
              {[
                { label: 'Material 3 Jetpack Compose', icon: Smartphone },
                { label: 'FIDO2 Passkeys & Knox TEE', icon: Lock },
                { label: 'WireGuard Sovereign DNS', icon: ShieldCheck },
                { label: 'Gemini 3.8 & Edge AI', icon: Cpu },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-2xs transition-colors ${
                      isAura
                        ? 'bg-white/90 border-slate-200/80 text-slate-700'
                        : 'bg-[#111218] border-rose-950/60 text-slate-300'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isAura ? 'text-indigo-600' : 'text-rose-400'}`} />
                    {item.label}
                  </span>
                );
              })}
            </div>

          </div>

          {/* Right Column: Hero Profile Card with Real Portraits Showcase (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className={`w-full max-w-sm rounded-[32px] p-4 border relative overflow-hidden transition-all duration-300 group shadow-xl ${
              isAura 
                ? 'bg-white/90 border-white shadow-indigo-200/30' 
                : 'bg-[#12131A] border-rose-900/40 shadow-rose-950/40'
            }`}>
              
              {/* Photo Container with aspect ratio */}
              <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden bg-slate-900 shadow-inner">
                <img 
                  src={currentPhoto.url} 
                  alt="Omar El Imarath" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle bottom gradient overlay for name & details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold">
                    {currentPhoto.title}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
                    Omar El Imarath
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {currentPhoto.caption}
                  </p>
                </div>

                {/* Autograph / Verification Stamp Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official Signature</span>
                </div>
              </div>

              {/* Photo Selector Switcher Pills */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {profilePhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center gap-2 ${
                      activePhotoIdx === idx
                        ? (isAura 
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold shadow-xs' 
                            : 'bg-rose-950/80 border-rose-700 text-white font-bold')
                        : (isAura 
                            ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' 
                            : 'bg-[#151622] border-slate-800 text-slate-400 hover:text-white')
                    }`}
                  >
                    <img 
                      src={photo.url} 
                      alt="" 
                      className="w-7 h-7 rounded-lg object-cover object-top shrink-0 border border-black/10" 
                    />
                    <span className="truncate text-[11px] font-medium">{photo.title}</span>
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Full Portrait Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">Omar El Imarath — Executive Portfolio Portraits</h4>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profilePhotos.map((photo, pIdx) => (
                <div key={pIdx} className="bg-slate-50 rounded-2xl p-2.5 border border-slate-200/80">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black mb-2">
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-900">{photo.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{photo.caption}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
