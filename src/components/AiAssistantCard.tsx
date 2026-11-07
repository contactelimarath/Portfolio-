import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Mic, 
  Copy, 
  Check, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  Terminal,
  Cpu,
  Smile
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

export const AiAssistantCard: React.FC = () => {
  const { theme } = useTheme();
  const isAura = theme === 'aura-light';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: "Hello! I am Omar's Portfolio AI Agent. I can answer questions about his Android Knox Passkey implementations (S24PasskeyScreen.kt), the sovereign OEI VPN & Anycast DNS architecture, his edge AI models, or how to collaborate directly.",
      time: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Tell me about S24PasskeyScreen.kt",
    "Explain the 6-phase security project lifecycle",
    "How does OEI VPN & DNS architecture work?",
    "What is Omar's tech stack & specialties?",
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const modelReply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply || "I am available to assist with Omar's technical portfolio.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelReply]);
    } catch (err) {
      // Resilient local intelligent fallback
      let fallbackText = "Omar specializes in Android Knox security, FIDO2 passkeys, and sovereign DNS architecture. You can connect with him directly at contact.elimarath@gmail.com.";
      const query = text.toLowerCase();
      if (query.includes('passkey') || query.includes('s24')) {
        fallbackText = "S24PasskeyScreen.kt is Omar's Material 3 Jetpack Compose UI that leverages Android Credential Manager API and Samsung Knox StrongBox TEE for hardware-attested, passwordless FIDO2 authentication.";
      } else if (query.includes('vpn') || query.includes('dns') || query.includes('oei')) {
        fallbackText = "The OEI VPN & DNS Architecture features a hardened WireGuard kernel interface with ChaCha20-Poly1305 encryption, coupled with a recursive Anycast DNS-over-HTTPS sinkhole at oeielite.dpdns.org to eliminate telemetry and DNS leaks.";
      } else if (query.includes('lifecycle') || query.includes('timeline') || query.includes('phase')) {
        fallbackText = "Omar's security project lifecycle spans 6 hardened phases: Phase 01 (Threat Modeling), Phase 02 (Cryptographic Architecture), Phase 03 (Kernel Tunneling & DNS), Phase 04 (Compose UI & Credential Manager), Phase 05 (Fuzzing & Red-Team Pentesting), and Phase 06 (Continuous Remote Attestation). Check the timeline in the Showcase section!";
      } else if (query.includes('contact') || query.includes('email') || query.includes('hire')) {
        fallbackText = "Reach out to Omar directly via email at contact.elimarath@gmail.com, or check out his custom domain at oeielite.dpdns.org and LinkedIn.";
      }

      const modelReply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, modelReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: "Conversation cleared. Feel free to ask about Omar's security engineering projects, Kotlin code, or portfolio architecture.",
        time: 'Just now',
      },
    ]);
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setInputValue("Tell me about Omar's mobile security background and Passkey work.");
      setTimeout(() => setIsListening(false), 2000);
    }
  };

  return (
    <section id="ai-assistant" className="w-full mt-12 scroll-mt-6">
      
      {/* Container Card */}
      <div className={`rounded-3xl p-6 sm:p-10 border transition-all ${
        isAura 
          ? 'glass-panel-aura' 
          : 'bg-[#101117] border-rose-900/30 shadow-lg shadow-rose-950/30'
      } ${isExpanded ? (isAura ? 'ring-2 ring-indigo-500/30' : 'ring-2 ring-rose-500/40') : ''}`}>
        
        {/* Top Header */}
        <div className={`flex items-center justify-between pb-6 border-b ${
          isAura ? 'border-slate-200/80' : 'border-rose-950/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md ${
              isAura 
                ? 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 shadow-indigo-200' 
                : 'bg-gradient-to-tr from-red-600 to-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${
                  isAura ? 'text-slate-900' : 'text-white'
                }`}>
                  AI Portfolio Agent
                </h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isAura 
                    ? 'bg-gradient-to-r from-violet-100 to-indigo-100 text-indigo-800 border-indigo-200/80' 
                    : 'bg-rose-950/80 text-rose-300 border-rose-800/40'
                }`}>
                  Gemini 3.8 Intelligence
                </span>
              </div>
              <p className={`text-xs ${isAura ? 'text-slate-500' : 'text-rose-200/60'}`}>
                Grounded on Omar's Android security architectures, Kotlin Compose, and sovereign network repos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={clearChat}
              className={`p-2 rounded-xl transition-colors ${
                isAura 
                  ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' 
                  : 'text-slate-400 hover:text-white hover:bg-rose-950/40'
              }`}
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-xl transition-colors ${
                isAura 
                  ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' 
                  : 'text-slate-400 hover:text-white hover:bg-rose-950/40'
              }`}
              title={isExpanded ? 'Collapse' : 'Expand view'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3D Iridescent Holographic Pastel Sphere with Visor Eyes (Directly modeled from screenshot 1!) */}
        <div className="my-6 flex flex-col items-center justify-center relative py-4">
          
          {/* Ambient Glow */}
          <div className={`absolute w-56 h-56 rounded-full blur-3xl -z-10 pointer-events-none ${
            isAura ? 'bg-gradient-to-tr from-pink-300/30 via-indigo-300/30 to-cyan-300/30' : 'bg-rose-600/25'
          }`}></div>

          {/* 3D Holographic AI Character */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex items-center justify-center animate-orb-float">
            
            {/* Outer pulsating aura */}
            <div className={`absolute inset-0 rounded-full ${
              isAura 
                ? 'animate-pastel-glow bg-gradient-to-tr from-pink-400/40 via-violet-400/30 to-cyan-300/40' 
                : 'animate-crimson-glow bg-gradient-to-tr from-red-600/40 via-rose-600/30 to-amber-500/20'
            }`}></div>

            {/* Glowing Orb Glass Body */}
            <div className={`w-full h-full rounded-full p-[3px] shadow-2xl relative overflow-hidden flex items-center justify-center ${
              isAura 
                ? 'bg-gradient-to-tr from-rose-200 via-indigo-200 to-cyan-100 shadow-indigo-300/50' 
                : 'bg-gradient-to-b from-rose-500 via-red-700 to-black'
            }`}>
              
              {/* Inner glass sphere reflection */}
              <div className={`w-full h-full rounded-full flex items-center justify-center relative ${
                isAura 
                  ? 'bg-gradient-to-br from-rose-100 via-violet-100 to-cyan-50' 
                  : 'bg-radial from-rose-400 via-red-950 to-black'
              }`}>
                
                {/* Cute Smiling Visor with Glowing Pill Eyes (from Screenshot 1!) */}
                {isAura ? (
                  <div className="w-16 h-8 rounded-full bg-[#1E1B4B] border border-indigo-300/40 shadow-inner flex items-center justify-center gap-2.5 z-10">
                    <div className="w-2.5 h-3.5 rounded-full bg-white animate-visor-blink shadow-[0_0_8px_#ffffff]"></div>
                    <div className="w-2.5 h-3.5 rounded-full bg-white animate-visor-blink shadow-[0_0_8px_#ffffff]"></div>
                  </div>
                ) : (
                  /* Holographic Pill Core for Dark Theme */
                  <div className="w-9 h-14 rounded-full border flex items-center justify-center rotate-45 transform bg-gradient-to-t from-rose-200 via-rose-500 to-red-600 border-rose-100/80 shadow-[0_0_20px_#f43f5e]">
                    <div className="w-5 h-5 rounded-full bg-white/40 blur-[1px]"></div>
                  </div>
                )}

                {/* Orbital particle rings */}
                <div className={`absolute inset-2 rounded-full border border-dashed animate-spin ${
                  isAura ? 'border-indigo-400/30' : 'border-rose-400/30'
                }`} style={{ animationDuration: '22s' }}></div>
                <div className={`absolute inset-4 rounded-full border ${
                  isAura ? 'border-pink-300/30' : 'border-red-400/20'
                }`}></div>

                {/* Top highlight specular flare */}
                <div className="absolute top-2 left-7 w-9 h-4 bg-white/60 rounded-full blur-[2px] transform -rotate-12"></div>
              </div>
            </div>

            {/* Floating micro spark badge */}
            <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border shadow-md ${
              isAura 
                ? 'bg-white border-indigo-200 text-indigo-600 shadow-xs' 
                : 'bg-[#101117] border-rose-500/50 text-rose-400'
            }`}>
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Friendly Greeting under orb matching screenshot 1 */}
          <div className="text-center mt-3">
            <h4 className={`text-base sm:text-lg font-extrabold tracking-tight ${
              isAura ? 'text-slate-900' : 'text-white'
            }`}>
              Hello, How can I Help you today?
            </h4>
            <span className={`text-[11px] font-mono mt-0.5 block ${
              isAura ? 'text-slate-500' : 'text-rose-300/70'
            }`}>
              Omar's Neural Enclave • Fueled by Gemini 3.8
            </span>
          </div>
        </div>

        {/* Chat Thread */}
        <div 
          ref={chatContainerRef}
          className={`space-y-4 overflow-y-auto pr-1 transition-all ${
            isExpanded ? 'max-h-[500px]' : 'max-h-[340px]'
          }`}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? (isAura ? 'bg-slate-900 text-white shadow-xs' : 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs')
                    : (isAura ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xs' : 'bg-rose-950/80 border border-rose-800/50 text-rose-300')
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                  msg.role === 'user'
                    ? (isAura ? 'bg-slate-900 text-white rounded-tr-xs shadow-md' : 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-xs shadow-md')
                    : (isAura ? 'bg-white text-slate-800 border border-indigo-100 rounded-tl-xs shadow-xs' : 'bg-[#14151F] text-slate-200 border border-rose-950/70 rounded-tl-xs shadow-2xs')
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                <div className={`flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[10px] font-mono ${
                  isAura ? 'border-slate-100 text-slate-400' : 'border-rose-950/50 text-rose-300/50'
                }`}>
                  <span>{msg.time}</span>
                  <button
                    onClick={() => copyMessage(msg.id, msg.text)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600 flex items-center gap-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 ${
                isAura ? 'bg-indigo-600' : 'bg-rose-600'
              }`}>
                <Bot className="w-4 h-4" />
              </div>
              <div className={`rounded-2xl rounded-tl-xs p-4 border text-xs flex items-center gap-2 ${
                isAura ? 'bg-white border-indigo-100 text-slate-700 shadow-xs' : 'bg-[#14151F] border-rose-950/70 text-rose-200'
              }`}>
                <span className={`w-2 h-2 rounded-full animate-bounce ${isAura ? 'bg-indigo-600' : 'bg-rose-500'}`}></span>
                <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:0.2s] ${isAura ? 'bg-indigo-600' : 'bg-rose-500'}`}></span>
                <span className={`w-2 h-2 rounded-full animate-bounce [animation-delay:0.4s] ${isAura ? 'bg-indigo-600' : 'bg-rose-500'}`}></span>
                <span className={`text-xs font-medium ml-1 ${isAura ? 'text-slate-600' : 'text-rose-300/70'}`}>
                  Analyzing security architecture...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills (Inspiration from screenshot 1: Trending Topic pills) */}
        <div className={`mt-5 pt-4 border-t ${isAura ? 'border-slate-200/70' : 'border-rose-950/60'}`}>
          <span className={`text-[11px] font-bold block mb-2 ${isAura ? 'text-slate-600' : 'text-rose-300/70'}`}>
            Trending Topics & Queries:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 text-left border shadow-2xs ${
                  isAura
                    ? 'bg-white/90 hover:bg-white text-slate-800 border-indigo-100/90 hover:border-indigo-300 shadow-xs'
                    : 'bg-[#151620] hover:bg-rose-950/60 text-rose-200 border-rose-900/40 hover:border-rose-700/60'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 relative flex items-center"
        >
          <div className="relative w-full flex items-center">
            <span className={`absolute left-4 font-medium text-lg pointer-events-none ${
              isAura ? 'text-indigo-400' : 'text-rose-400'
            }`}>
              +
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about Omar's mobile security, Knox Passkey, or hire inquiries..."
              className={`w-full pl-9 pr-24 py-3.5 rounded-2xl border text-xs sm:text-sm outline-none transition-all shadow-sm ${
                isAura
                  ? 'bg-white/95 border-indigo-100/90 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 placeholder:text-slate-400'
                  : 'bg-[#151620] border-rose-950/80 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-white placeholder:text-slate-500'
              }`}
            />
            
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2 rounded-xl transition-colors ${
                  isListening 
                    ? (isAura ? 'text-indigo-600 bg-indigo-50 animate-pulse' : 'text-rose-400 bg-rose-950 animate-pulse') 
                    : (isAura ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white')
                }`}
                title="Voice input simulation"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md disabled:opacity-40 text-white ${
                  isAura
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 shadow-indigo-300/40 hover:brightness-105'
                    : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 shadow-rose-950/60 hover:brightness-110'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

      </div>

    </section>
  );
};
