import React, { useState, useEffect } from 'react';
import { HeaderHero } from './components/HeaderHero.tsx';
import { MetricsAtAGlance } from './components/MetricsAtAGlance.tsx';
import { ShowcaseSection } from './components/ShowcaseSection.tsx';
import { AiAssistantCard } from './components/AiAssistantCard.tsx';
import { ContactFooter } from './components/ContactFooter.tsx';
import { FloatingDock } from './components/FloatingDock.tsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

function AppContent() {
  const { theme } = useTheme();
  const isNova = theme === 'nova-crimson';
  const [activeSection, setActiveSection] = useState<string>('hero');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Observe active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['contact', 'ai-assistant', 'showcase', 'metrics'];
      const scrollPos = window.scrollY + 250;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen relative flex flex-col justify-between transition-colors duration-500 font-sans ${
      isNova 
        ? 'bg-[#07080B] text-[#F8FAFC] selection:bg-rose-500/30 selection:text-rose-200' 
        : 'bg-[#F4F6FC] text-[#0F172A] selection:bg-indigo-500/20 selection:text-indigo-900'
    }`}>
      
      {/* Background Ambient Lighting (Ethereal Pastel Aura vs Nova Crimson) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {isNova ? (
          <>
            {/* Top Dramatic Crimson Aura from Nova Screenshot */}
            <div className="absolute -top-24 inset-x-0 mx-auto w-full max-w-5xl h-[520px] bg-gradient-to-b from-rose-600/35 via-red-700/20 to-transparent blur-[110px]"></div>
            <div className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-red-600/15 via-rose-900/10 to-transparent blur-[120px]"></div>
            <div className="absolute top-2/3 -left-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-rose-900/15 via-red-950/10 to-transparent blur-[130px]"></div>
          </>
        ) : (
          <>
            {/* Ethereal Lavender, Violet & Rose Pastel Aura Glow from Light Theme Screenshot */}
            <div className="absolute -top-32 inset-x-0 mx-auto w-full max-w-5xl h-[580px] bg-gradient-to-b from-indigo-200/50 via-purple-100/40 to-transparent blur-[110px]"></div>
            <div className="absolute top-12 right-0 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-pink-200/45 via-indigo-100/35 to-transparent blur-[120px]"></div>
            <div className="absolute top-1/2 -left-24 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-200/40 via-purple-100/30 to-transparent blur-[130px]"></div>
            <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-indigo-100/40 via-pink-100/25 to-transparent blur-[120px]"></div>
          </>
        )}
      </div>

      {/* Main Single-Page Responsive Container */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        
        {/* 1. Header / Hero Section */}
        <section id="hero">
          <HeaderHero
            onOpenAi={() => scrollToSection('ai-assistant')}
            onNavigateSection={scrollToSection}
          />
        </section>

        {/* 2. Metrics / At-a-Glance Grid */}
        <div id="metrics" className="scroll-mt-6">
          <MetricsAtAGlance />
        </div>

        {/* 3. Interactive Showcase Section with Timeline */}
        <ShowcaseSection />

        {/* 4. Embedded AI Assistant Card */}
        <AiAssistantCard />

        {/* 5. Contact & Connect Footer */}
        <ContactFooter />

      </main>

      {/* Floating Capsule Dock */}
      <FloatingDock 
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
