import React from 'react';
import { Home, Sparkles, Activity, Shield, Mail, Smartphone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface FloatingDockProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ activeSection, onNavigate }) => {
  const { theme } = useTheme();
  const isNova = theme === 'nova-crimson';

  const items = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'metrics', label: 'Metrics', icon: Activity },
    { id: 'showcase', label: 'Showcase', icon: Smartphone },
    { id: 'ai-assistant', label: 'Ask AI', icon: Sparkles },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <nav className="fixed bottom-6 inset-x-0 mx-auto w-fit z-40 px-3">
      <div className={`backdrop-blur-2xl border shadow-2xl rounded-full p-1.5 flex items-center gap-1 sm:gap-2 transition-all ${
        isNova 
          ? 'bg-[#0E0F15]/95 border-rose-900/40 shadow-rose-950/50' 
          : 'bg-[#0F172A]/90 backdrop-blur-xl border-white/20 shadow-xl shadow-indigo-950/20'
      }`}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-300 active:scale-95 ${
                isActive
                  ? (isNova
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.6)] font-bold'
                      : 'bg-white text-[#0F172A] shadow-md font-bold')
                  : (isNova 
                      ? 'text-slate-400 hover:text-rose-200 hover:bg-rose-950/40' 
                      : 'text-slate-400 hover:text-white hover:bg-white/10')
              }`}
            >
              <Icon className={`w-4 h-4 ${
                isActive 
                  ? (isNova ? 'text-white' : 'text-[#0F172A]') 
                  : 'text-slate-400'
              }`} />
              <span className={`${isActive ? 'inline-block' : 'hidden sm:inline-block'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
