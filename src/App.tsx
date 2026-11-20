import React, { FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, Code2, Github,
  Globe2, Linkedin, LockKeyhole, Mail, Menu, MessageCircle, Send, ShieldCheck,
  Sparkles, Terminal, X, Zap
} from 'lucide-react';

type ChatMessage = { role: 'user' | 'model'; text: string };

const projects = [
  {
    number: '01',
    icon: LockKeyhole,
    category: 'ANDROID SECURITY',
    title: 'Passkeys & device trust',
    description: 'Exploring passwordless authentication with Android Credential Manager, FIDO2 and hardware-backed key storage.',
    tags: ['Kotlin', 'Credential Manager', 'FIDO2'],
  },
  {
    number: '02',
    icon: Globe2,
    category: 'NETWORK PRIVACY',
    title: 'OEI network architecture',
    description: 'A privacy-focused network architecture study covering WireGuard tunnels, encrypted DNS and resilient connectivity.',
    tags: ['WireGuard', 'DoH / DoT', 'Networking'],
  },
  {
    number: '03',
    icon: Sparkles,
    category: 'APPLIED AI',
    title: 'Portfolio AI assistant',
    description: 'A conversational interface backed by a server-side Gemini integration, with a local fallback when the provider is unavailable.',
    tags: ['TypeScript', 'Cloudflare Workers', 'Gemini API'],
  },
];

const capabilities = ['Android & Kotlin', 'Application security', 'Passkeys / FIDO2', 'TypeScript', 'Cloudflare Workers', 'AI integration'];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [apiState, setApiState] = useState<'checking' | 'online' | 'offline'>('checking');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello. Ask me about Omar's technical interests, portfolio projects or ways to collaborate." },
  ]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable');
        return response.json();
      })
      .then((data) => { if (active) setApiState(data.ok ? 'online' : 'offline'); })
      .catch(() => { if (active) setApiState('offline'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, sending]);

  const navigate = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message || sending) return;
    const nextMessages = [...messages, { role: 'user' as const, text: message }];
    setMessages(nextMessages);
    setDraft('');
    setSending(true);
    setChatError('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: messages.slice(-6).map(({ role, text }) => ({ role, text })),
        }),
      });
      const data = await response.json();
      if (!response.ok || typeof data.reply !== 'string') {
        throw new Error(data.error || 'The assistant could not respond. Please try again.');
      }
      setMessages((current) => [...current, { role: 'model', text: data.reply }]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'Connection failed. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f2ed] text-[#191a18] selection:bg-[#d5f36a] selection:text-[#191a18]">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#top" className="group flex items-center gap-3" aria-label="Omar El Imarath home">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#191a18] text-sm font-bold tracking-tight text-[#d5f36a]">OE</span>
          <span className="text-sm font-semibold tracking-tight">OMAR EL IMARATH<span className="ml-2 text-[#8b8c84]">/ PORTFOLIO</span></span>
        </a>
        <nav className="hidden items-center gap-9 text-sm text-[#65665f] md:flex">
          <button onClick={() => navigate('work')} className="transition hover:text-black">Selected work</button>
          <button onClick={() => navigate('about')} className="transition hover:text-black">About</button>
          <button onClick={() => navigate('contact')} className="transition hover:text-black">Contact</button>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-xs text-[#65665f] sm:flex">
            <span className={`h-2 w-2 rounded-full ${apiState === 'online' ? 'bg-[#74a82b]' : apiState === 'offline' ? 'bg-[#c56a50]' : 'bg-[#b4b4aa]'}`} />
            {apiState === 'online' ? 'Systems online' : apiState === 'offline' ? 'API unavailable' : 'Checking systems'}
          </span>
          <button onClick={() => navigate('contact')} className="hidden rounded-full bg-[#d5f36a] px-5 py-3 text-xs font-bold text-[#191a18] transition hover:bg-[#c5e45a] sm:block">LET'S TALK <ArrowUpRight className="ml-2 inline h-3.5 w-3.5" /></button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-black/10 p-2.5 md:hidden" aria-label="Toggle navigation">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </header>
      {menuOpen && <div className="relative z-30 mx-5 rounded-2xl border border-black/10 bg-white p-4 shadow-xl md:hidden"><div className="grid gap-3 text-sm"><button onClick={() => navigate('work')} className="text-left">Selected work</button><button onClick={() => navigate('about')} className="text-left">About</button><button onClick={() => navigate('contact')} className="text-left">Contact</button></div></div>}

      <main id="top">
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.12fr_.88fr] lg:px-12 lg:pb-32 lg:pt-28">
          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-[10px] font-bold tracking-[.18em] text-[#606158]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8aa83d]" /> INDEPENDENT BUILDER · SRI LANKA / REMOTE
            </div>
            <h1 className="max-w-3xl text-[clamp(3.6rem,8.2vw,7.7rem)] font-semibold leading-[.91] tracking-[-.075em]">
              Building with <span className="font-serif font-normal italic text-[#77796c]">intent.</span><br />
              Securing what<br />matters<span className="text-[#a6c94a]">.</span>
            </h1>
            <p className="mt-9 max-w-xl text-base leading-8 text-[#66675f] sm:text-lg">
              I’m Omar. I work across software, Android security and applied AI—turning complex technical ideas into useful, dependable systems.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button onClick={() => navigate('work')} className="group rounded-full bg-[#191a18] px-7 py-4 text-xs font-bold tracking-wide text-white transition hover:bg-[#34352f]">EXPLORE THE WORK <ArrowDown className="ml-3 inline h-4 w-4 transition group-hover:translate-y-1" /></button>
              <button onClick={() => setChatOpen(true)} className="flex items-center gap-2 rounded-full border border-black/15 px-6 py-4 text-xs font-bold transition hover:bg-white"><MessageCircle size={15} /> ASK THE AI</button>
            </div>
            <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-black/10 pt-6 text-[10px] font-bold tracking-[.16em] text-[#85867d]">
              <span>01 / ENGINEERING</span><span>02 / SECURITY</span><span>03 / INTELLIGENCE</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -right-6 -top-8 h-36 w-36 rounded-full bg-[#d5f36a]/70 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#20231e] p-6 text-white shadow-[0_35px_90px_-45px_rgba(30,35,20,.55)] sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <span className="text-[10px] font-bold tracking-[.2em] text-white/50">SYSTEMS / OVERVIEW</span>
                <span className="flex items-center gap-2 text-[10px] text-[#d5f36a]"><span className="h-1.5 w-1.5 rounded-full bg-[#d5f36a]" /> AVAILABLE</span>
              </div>
              <div className="py-9">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d5f36a] text-[#20231e]"><Terminal size={22} /></div>
                  <div><p className="text-sm font-semibold">Technical focus</p><p className="mt-1 text-xs text-white/45">A practical, evolving toolkit</p></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Mobile security', 'AI systems', 'Network privacy', 'Web engineering'].map((item, i) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><span className="mb-5 block text-[10px] text-[#d5f36a]">0{i + 1}</span><span className="text-sm font-medium">{item}</span></div>)}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-5 text-[10px] text-white/40"><span>BUILD / TEST / IMPROVE</span><span>OEI — 2026</span></div>
            </div>
            <div className="absolute -bottom-7 -left-5 hidden rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-xl sm:block"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef5d9] text-[#536a20]"><ShieldCheck size={18} /></div><div><p className="text-xs font-bold">Security by design</p><p className="mt-1 text-[10px] text-[#77796f]">A principle, not a badge</p></div></div></div>
          </div>
        </section>

        <section id="work" className="border-y border-black/10 bg-[#ebe9e2]">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div><p className="mb-4 text-[10px] font-bold tracking-[.22em] text-[#85867d]">SELECTED AREAS / 01—03</p><h2 className="max-w-2xl text-5xl font-semibold tracking-[-.06em] sm:text-6xl">Work in <span className="font-serif font-normal italic text-[#77796c]">progress.</span></h2></div>
              <p className="max-w-sm text-sm leading-7 text-[#717268]">A concise view of the technical themes and systems I’m developing. Details are presented as project areas, not unverified performance claims.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {projects.map((project) => {
                const Icon = project.icon;
                return <article key={project.number} className="group flex min-h-[330px] flex-col rounded-[1.7rem] border border-black/10 bg-[#f8f7f2] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 sm:p-8">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-[.18em] text-[#85867d]">{project.category}</span><span className="text-xs text-[#9b9c92]">{project.number}</span></div>
                  <div className="my-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#20231e] text-[#d5f36a] transition group-hover:rotate-[-5deg]"><Icon size={24} /></div>
                  <h3 className="text-2xl font-semibold tracking-[-.04em]">{project.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-[#73746b]">{project.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] font-medium text-[#6e7067]">{tag}</span>)}</div>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-32">
          <div><p className="mb-4 text-[10px] font-bold tracking-[.22em] text-[#85867d]">A LITTLE ABOUT ME / 04</p><h2 className="text-5xl font-semibold leading-[.98] tracking-[-.06em] sm:text-6xl">Curiosity<br />with a <span className="font-serif font-normal italic text-[#77796c]">purpose.</span></h2></div>
          <div className="max-w-2xl">
            <p className="text-xl leading-9 tracking-[-.02em] text-[#45473f]">I’m interested in the point where engineering, security and human needs meet. My approach is to understand the problem, build the smallest useful solution, test it honestly and improve it step by step.</p>
            <p className="mt-6 text-sm leading-8 text-[#77796f]">I value clear architecture, maintainable code, privacy-conscious decisions and practical learning. This portfolio is a working record of that process—not a list of inflated claims.</p>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-black/10 pt-8 sm:grid-cols-3">{capabilities.map((item) => <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#56584f]"><Check size={14} className="text-[#86a43d]" />{item}</div>)}</div>
          </div>
        </section>

        <section className="bg-[#20231e] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <div><p className="mb-3 text-[10px] font-bold tracking-[.2em] text-[#d5f36a]">HOW I WORK</p><h2 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Less noise. More working systems.</h2></div>
            <div className="flex flex-wrap gap-3">{['Understand', 'Architect', 'Build', 'Verify'].map((step, i) => <div key={step} className="flex items-center gap-3 rounded-full border border-white/15 px-4 py-3 text-xs text-white/80"><span className="text-[#d5f36a]">0{i + 1}</span>{step}</div>)}</div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="overflow-hidden rounded-[2rem] bg-[#d5f36a] p-8 sm:p-12 lg:p-16">
            <p className="mb-5 text-[10px] font-bold tracking-[.22em] text-[#56632e]">HAVE A GOOD PROBLEM TO SOLVE?</p>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div><h2 className="max-w-3xl text-5xl font-semibold leading-[.95] tracking-[-.07em] sm:text-7xl">Let’s make<br />something <span className="font-serif font-normal italic">useful.</span></h2><p className="mt-7 max-w-lg text-sm leading-7 text-[#58613f]">For technical discussions, collaboration or project enquiries, contact me directly.</p></div>
              <div className="flex flex-col gap-3"><a href="mailto:contact.elimarath@gmail.com" className="inline-flex items-center justify-between gap-8 rounded-full bg-[#191a18] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#34352f]">Email Omar <ArrowUpRight size={18} /></a><a href="https://linkedin.com/in/omar-el-imarath" target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-8 rounded-full border border-[#191a18]/25 px-6 py-4 text-sm font-semibold transition hover:bg-white/30">LinkedIn <ArrowUpRight size={18} /></a><a href="https://github.com/contactelimarath" target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-8 rounded-full border border-[#191a18]/25 px-6 py-4 text-sm font-semibold transition hover:bg-white/30">GitHub <ArrowUpRight size={18} /></a></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-black/10 px-5 py-7 text-[10px] text-[#85867d] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} OMAR EL IMARATH. BUILT WITH INTENT.</span>
        <span className="flex items-center gap-4"><a href="mailto:contact.elimarath@gmail.com" className="hover:text-black">EMAIL</a><a href="https://linkedin.com/in/omar-el-imarath" target="_blank" rel="noreferrer" className="hover:text-black">LINKEDIN</a><a href="https://github.com/contactelimarath" target="_blank" rel="noreferrer" className="hover:text-black">GITHUB</a></span>
      </footer>

      {chatOpen && <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30 p-3 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setChatOpen(false); }}>
        <section className="flex max-h-[min(680px,92vh)] w-full max-w-md flex-col overflow-hidden rounded-[1.7rem] bg-[#f8f7f2] shadow-2xl">
          <div className="flex items-center justify-between bg-[#20231e] px-5 py-4 text-white"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d5f36a] text-[#20231e]"><Sparkles size={18} /></div><div><p className="text-sm font-semibold">Portfolio assistant</p><p className="mt-0.5 text-[10px] text-white/50">Ask about projects & collaboration</p></div></div><button onClick={() => setChatOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Close assistant"><X size={18} /></button></div>
          <div className="min-h-[260px] flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => <div key={index} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'ml-auto bg-[#d5f36a] text-[#20231e]' : 'bg-white text-[#45473f] shadow-sm'}`}>{message.text}</div>)}
            {sending && <div className="w-fit rounded-2xl bg-white px-4 py-3 text-xs text-[#77796f]">Thinking…</div>}
            <div ref={chatEndRef} />
          </div>
          {chatError && <p className="px-4 pb-2 text-xs text-[#a24e3a]">{chatError}</p>}
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-black/10 p-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={8000} placeholder="Ask a question…" className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#9ebd48]" /><button type="submit" disabled={sending || !draft.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#20231e] text-[#d5f36a] transition hover:bg-black disabled:opacity-40" aria-label="Send message"><Send size={17} /></button></form>
        </section>
      </div>}
    </div>
  );
}
