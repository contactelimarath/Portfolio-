import React, { FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowDown, ArrowUpRight, Check, Github, Linkedin, Mail, Menu,
  MessageCircle, Send, ShieldCheck, Sparkles, Terminal, X, Zap
} from 'lucide-react';

type ChatMessage = { role: 'user' | 'model'; text: string };

const LINKEDIN_URL = 'https://www.linkedin.com/in/omar-el-imarath/';
const GITHUB_URL = 'https://github.com/contactelimarath';
const PROFILE_PHOTOS = [
  {
    src: '/assets/aistudio/Picsart_26-10-30_21-28-35-190_c13026d2.jpg',
    title: 'Executive portrait',
    description: 'A formal portrait for the portfolio.'
  },
  {
    src: '/assets/aistudio/file_0000000012288211b2448abce1ed5a5e_1__64e77f49.png',
    title: 'Editorial portrait',
    description: 'The second portrait from the original portfolio assets.'
  }
];

const projects = [
  {
    number: '01',
    category: 'ANDROID SECURITY',
    title: 'Passkeys & device trust',
    description: 'Exploring passwordless authentication with Android Credential Manager, FIDO2 and hardware-backed key storage.',
    tags: ['Kotlin', 'Credential Manager', 'FIDO2']
  },
  {
    number: '02',
    category: 'NETWORK PRIVACY',
    title: 'OEI network architecture',
    description: 'A privacy-focused network architecture study covering WireGuard tunnels, encrypted DNS and resilient connectivity.',
    tags: ['WireGuard', 'DoH / DoT', 'Networking']
  },
  {
    number: '03',
    category: 'APPLIED AI',
    title: 'Portfolio AI assistant',
    description: 'A conversational interface backed by a server-side Gemini integration, with a local fallback when the provider is unavailable.',
    tags: ['TypeScript', 'Cloudflare Pages Functions', 'Gemini API']
  }
];

const capabilities = [
  'Android & Kotlin',
  'Application security',
  'Passkeys / FIDO2',
  'TypeScript',
  'Cloudflare Workers',
  'Applied AI'
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [apiState, setApiState] = useState<'checking' | 'online' | 'offline'>('checking');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello. Ask me about Omar's technical interests, portfolio projects or ways to collaborate." }
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
      .then((data) => {
        if (active) setApiState(data.ok ? 'online' : 'offline');
      })
      .catch(() => {
        if (active) setApiState('offline');
      });
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

    setMessages((current) => [...current, { role: 'user', text: message }]);
    setDraft('');
    setSending(true);
    setChatError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: messages.slice(-6).map(({ role, text }) => ({ role, text }))
        })
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

  const statusLabel = apiState === 'online'
    ? 'API online'
    : apiState === 'offline'
      ? 'API unavailable'
      : 'Checking API';

  return (
    <div className="min-h-screen overflow-hidden bg-[#08090d] text-[#f4f1eb] selection:bg-[#d8ff72] selection:text-[#10120c]">
      <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-3" aria-label="Omar El Imarath home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8ff72]/40 bg-[#d8ff72] text-sm font-black tracking-tight text-[#10120c]">OE</span>
          <span className="text-sm font-bold tracking-[.08em]">OMAR EL IMARATH <span className="text-[#777a82]">/ PORTFOLIO</span></span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-[#a4a5ad] md:flex">
          <button onClick={() => navigate('work')} className="transition hover:text-white">Selected work</button>
          <button onClick={() => navigate('about')} className="transition hover:text-white">About</button>
          <button onClick={() => navigate('contact')} className="transition hover:text-white">Contact</button>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-xs text-[#a4a5ad] sm:flex">
            <span className={'h-2 w-2 rounded-full ' + (apiState === 'online' ? 'bg-[#a7df54]' : apiState === 'offline' ? 'bg-[#e07b68]' : 'bg-[#8b8d95]')} />
            {statusLabel}
          </span>
          <button onClick={() => navigate('contact')} className="hidden rounded-full bg-[#d8ff72] px-5 py-3 text-xs font-extrabold text-[#10120c] transition hover:bg-[#c8ef63] sm:block">
            LET'S TALK <ArrowUpRight className="ml-2 inline h-3.5 w-3.5" />
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-white/15 p-2.5 md:hidden" aria-label="Toggle navigation">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="relative z-40 mx-5 rounded-2xl border border-white/10 bg-[#12141b] p-4 shadow-xl md:hidden">
          <div className="grid gap-4 text-sm text-[#e7e5df]">
            <button onClick={() => navigate('work')} className="text-left">Selected work</button>
            <button onClick={() => navigate('about')} className="text-left">About</button>
            <button onClick={() => navigate('contact')} className="text-left">Contact</button>
          </div>
        </div>
      )}

      <main id="top">
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-32 lg:pt-24">
          <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#d8ff72]/[.07] blur-[110px]" />
          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-[10px] font-bold tracking-[.18em] text-[#c2c3c9]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d8ff72]" /> INDEPENDENT BUILDER · SRI LANKA / REMOTE
            </div>

            <h1 className="max-w-3xl text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[.92] tracking-[-.075em]">
              Building with <span className="font-serif font-normal italic text-[#d8ff72]">intent.</span><br />
              Securing what<br />matters<span className="text-[#d8ff72]">.</span>
            </h1>

            <p className="mt-9 max-w-xl text-base leading-8 text-[#a4a5ad] sm:text-lg">
              I'm Omar. I work across software, Android security and applied AI—turning complex technical ideas into useful, dependable systems.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button onClick={() => navigate('work')} className="group rounded-full bg-[#d8ff72] px-7 py-4 text-xs font-extrabold tracking-wide text-[#10120c] transition hover:bg-[#c8ef63]">
                EXPLORE THE WORK <ArrowDown className="ml-3 inline h-4 w-4 transition group-hover:translate-y-1" />
              </button>
              <button onClick={() => setChatOpen(true)} className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-xs font-bold text-white transition hover:border-[#d8ff72]/60 hover:bg-white/[.05]">
                <MessageCircle size={15} /> ASK THE AI
              </button>
            </div>

            <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-[10px] font-bold tracking-[.16em] text-[#777a82]">
              <span>01 / ENGINEERING</span><span>02 / SECURITY</span><span>03 / INTELLIGENCE</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-[#d8ff72]/10 blur-3xl" />
            <div className="relative grid grid-cols-[1.15fr_.85fr] items-center gap-3 sm:gap-4">
              <button onClick={() => setActivePhoto(0)} className={'group relative overflow-hidden rounded-[1.8rem] border bg-[#171920] text-left shadow-2xl transition ' + (activePhoto === 0 ? 'border-[#d8ff72]/70 ring-1 ring-[#d8ff72]/30' : 'border-white/10')}>
                <img src={PROFILE_PHOTOS[0].src} alt="Omar El Imarath — executive portrait" className="aspect-[4/5] w-full object-cover object-top transition duration-700 group-hover:scale-[1.03]" fetchPriority="high" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 pt-16 sm:p-5 sm:pt-20">
                  <span className="block text-[10px] font-bold uppercase tracking-[.18em] text-[#d8ff72]">01 / PORTRAIT</span>
                  <span className="mt-1 block text-sm font-semibold text-white sm:text-base">Executive portrait</span>
                </span>
              </button>

              <div className="flex flex-col gap-3 sm:gap-4">
                <button onClick={() => setActivePhoto(1)} className={'group relative overflow-hidden rounded-[1.6rem] border bg-[#171920] text-left transition ' + (activePhoto === 1 ? 'border-[#d8ff72]/70 ring-1 ring-[#d8ff72]/30' : 'border-white/10')}>
                  <img src={PROFILE_PHOTOS[1].src} alt="Omar El Imarath — editorial signature portrait" className="aspect-[4/5] w-full object-cover object-top transition duration-700 group-hover:scale-[1.03]" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-12 sm:p-4 sm:pt-16">
                    <span className="block text-[9px] font-bold uppercase tracking-[.16em] text-[#d8ff72]">02 / PORTRAIT</span>
                    <span className="mt-1 block text-xs font-semibold text-white sm:text-sm">Editorial portrait</span>
                  </span>
                </button>
                <div className="rounded-[1.5rem] border border-white/10 bg-[#12141b] p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8ff72] text-[#10120c]"><ShieldCheck size={20} /></div>
                    <div>
                      <p className="text-xs font-bold text-white">Build. Test. Verify.</p>
                      <p className="mt-1 text-[10px] text-[#92949d]">A practical engineering approach</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-right text-[10px] font-medium tracking-[.12em] text-[#6f727b]">TWO ORIGINAL PORTFOLIO PORTRAITS</p>
          </div>
        </section>

        <section id="work" className="border-y border-white/10 bg-[#0e1016]">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-4 text-[10px] font-bold tracking-[.22em] text-[#d8ff72]">SELECTED AREAS / 01—03</p>
                <h2 className="max-w-2xl text-5xl font-semibold tracking-[-.06em] sm:text-6xl">Work in <span className="font-serif font-normal italic text-[#d8ff72]">progress.</span></h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[#92949d]">A concise view of the technical themes and systems I'm developing. Details are presented as project areas, not unverified performance claims.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {projects.map((project) => (
                <article key={project.number} className="group flex min-h-[330px] flex-col rounded-[1.7rem] border border-white/10 bg-[#151821] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#d8ff72]/30 hover:shadow-xl hover:shadow-black/20 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-[.18em] text-[#a0a2ab]">{project.category}</span>
                    <span className="text-xs text-[#6f727b]">{project.number}</span>
                  </div>
                  <div className="my-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d8ff72] text-[#10120c] transition group-hover:rotate-[-5deg]"><Terminal size={24} /></div>
                  <h3 className="text-2xl font-semibold tracking-[-.04em] text-white">{project.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-[#a0a2ab]">{project.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {project.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1.5 text-[10px] font-medium text-[#b7b8bf]">{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-32">
          <div>
            <p className="mb-4 text-[10px] font-bold tracking-[.22em] text-[#d8ff72]">A LITTLE ABOUT ME / 04</p>
            <h2 className="text-5xl font-semibold leading-[.98] tracking-[-.06em] sm:text-6xl">Curiosity<br />with a <span className="font-serif font-normal italic text-[#d8ff72]">purpose.</span></h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-xl leading-9 tracking-[-.02em] text-[#e0ded8]">I'm interested in the point where engineering, security and human needs meet. My approach is to understand the problem, build the smallest useful solution, test it honestly and improve it step by step.</p>
            <p className="mt-6 text-sm leading-8 text-[#92949d]">I value clear architecture, maintainable code, privacy-conscious decisions and practical learning. This portfolio is a working record of that process—not a list of inflated claims.</p>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-8 sm:grid-cols-3">
              {capabilities.map((item) => <div key={item} className="flex items-center gap-2 text-xs font-semibold text-[#c6c5c0]"><Check size={14} className="shrink-0 text-[#d8ff72]" />{item}</div>)}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0e1016]">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-[.2em] text-[#d8ff72]">HOW I WORK</p>
              <h2 className="text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">Less noise. More working systems.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Understand', 'Architect', 'Build', 'Verify'].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-full border border-white/15 px-4 py-3 text-xs text-[#deddd7]"><span className="text-[#d8ff72]">0{index + 1}</span>{step}</div>)}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="overflow-hidden rounded-[2rem] border border-[#d8ff72]/30 bg-gradient-to-br from-[#d8ff72] via-[#c5ed63] to-[#a7d64c] p-8 text-[#10120c] sm:p-12 lg:p-16">
            <p className="mb-5 text-[10px] font-extrabold tracking-[.22em] text-[#43541f]">HAVE A GOOD PROBLEM TO SOLVE?</p>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="max-w-3xl text-5xl font-semibold leading-[.95] tracking-[-.07em] sm:text-7xl">Let's make<br />something <span className="font-serif font-normal italic">useful.</span></h2>
                <p className="mt-7 max-w-lg text-sm leading-7 text-[#46532c]">For technical discussions, collaboration or project enquiries, contact me directly.</p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="mailto:contact.elimarath@gmail.com" className="inline-flex items-center justify-between gap-8 rounded-full bg-[#10120c] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#292d20]">Email Omar <ArrowUpRight size={18} /></a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between gap-8 rounded-full border border-[#10120c]/30 px-6 py-4 text-sm font-semibold transition hover:bg-white/25">LinkedIn <Linkedin size={17} /></a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between gap-8 rounded-full border border-[#10120c]/30 px-6 py-4 text-sm font-semibold transition hover:bg-white/25">GitHub <Github size={17} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 px-5 py-7 text-[10px] text-[#777a82] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} OMAR EL IMARATH. BUILT WITH INTENT.</span>
        <span className="flex items-center gap-4">
          <a href="mailto:contact.elimarath@gmail.com" className="transition hover:text-white">EMAIL</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">LINKEDIN</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">GITHUB</a>
        </span>
      </footer>

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setChatOpen(false); }}>
          <section className="flex max-h-[min(680px,92vh)] w-full max-w-md flex-col overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#11141b] shadow-2xl">
            <div className="flex items-center justify-between bg-[#d8ff72] px-5 py-4 text-[#10120c]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10120c] text-[#d8ff72]"><Sparkles size={18} /></div>
                <div><p className="text-sm font-bold">Portfolio assistant</p><p className="mt-0.5 text-[10px] text-[#46532c]">Ask about projects & collaboration</p></div>
              </div>
              <button onClick={() => setChatOpen(false)} className="rounded-full p-2 hover:bg-black/10" aria-label="Close assistant"><X size={18} /></button>
            </div>
            <div className="min-h-[260px] flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((message, index) => <div key={index} className={'max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ' + (message.role === 'user' ? 'ml-auto bg-[#d8ff72] text-[#10120c]' : 'bg-[#20242e] text-[#e7e5df]')}>{message.text}</div>)}
              {sending && <div className="w-fit rounded-2xl bg-[#20242e] px-4 py-3 text-xs text-[#a4a5ad]">Thinking…</div>}
              <div ref={chatEndRef} />
            </div>
            {chatError && <p className="px-4 pb-2 text-xs text-[#f28f7e]">{chatError}</p>}
            <form onSubmit={sendMessage} className="flex gap-2 border-t border-white/10 p-3">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={8000} placeholder="Ask a question…" className="min-w-0 flex-1 rounded-full border border-white/10 bg-[#20242e] px-4 py-3 text-sm text-white outline-none placeholder:text-[#777a82] focus:border-[#d8ff72]/60" />
              <button type="submit" disabled={sending || !draft.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d8ff72] text-[#10120c] transition hover:bg-[#c8ef63] disabled:opacity-40" aria-label="Send message"><Send size={17} /></button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
