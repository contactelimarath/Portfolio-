import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

export const ScrollProgressBar: React.FC = () => {
  const { theme } = useTheme();
  const isNova = theme === 'nova-crimson';
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setScrollProgress(progress);
        setIsVisible(scrollY > 15);
      } else {
        setScrollProgress(0);
        setIsVisible(false);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    // Initial check
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      {/* Background track */}
      <div 
        className={`absolute inset-0 backdrop-blur-xs ${
          isNova ? 'bg-rose-950/20' : 'bg-slate-200/40'
        }`} 
      />

      {/* Progress fill using hardware-accelerated transform */}
      <div
        className={`h-full w-full origin-left transition-transform duration-100 ease-out ${
          isNova
            ? 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 shadow-[0_0_12px_rgba(244,63,94,0.7)]'
            : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
        }`}
        style={{
          transform: `scaleX(${scrollProgress / 100})`,
        }}
      />

      {/* Leading Edge Glow Point */}
      {scrollProgress > 1 && scrollProgress < 99.5 && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 -ml-1 w-2 h-2 rounded-full blur-[1.5px] transition-all duration-100 ease-out ${
            isNova ? 'bg-amber-300 shadow-[0_0_8px_#f59e0b]' : 'bg-cyan-300 shadow-[0_0_8px_#06b6d4]'
          }`}
          style={{
            left: `${scrollProgress}%`,
          }}
        />
      )}
    </div>
  );
};
