import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  ExternalLink, 
  Copy, 
  Check, 
  Linkedin, 
  Globe, 
  ShieldCheck, 
  Key, 
  ArrowUp,
  Terminal,
  Send,
  Sparkles,
  Shield,
  MessageSquare,
  LogIn
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { collection, doc, setDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export const ContactFooter: React.FC = () => {
  const { theme } = useTheme();
  const isNova = theme === 'nova-crimson';
  const { user, signInWithGoogle, isAdmin, isSigningIn } = useAuth();

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPgp, setCopiedPgp] = useState(false);
  const [showPgpModal, setShowPgpModal] = useState(false);

  // Firestore Inquiry Form State
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState<'mobile-security' | 'ai-development' | 'knox-passkey' | 'vpn-dns' | 'general'>('mobile-security');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccessId, setInquirySuccessId] = useState<string | null>(null);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  // Recent Inquiries from Firestore
  const [myInquiries, setMyInquiries] = useState<any[]>([]);

  const primaryEmail = "contact.elimarath@gmail.com";
  const customDomain = "oeielite.dpdns.org";
  const linkedInUrl = "https://linkedin.com/in/omar-el-imarath";
  const pgpFingerprint = "9F82 C34E 811B 004A 77CD  52A9 4E88 1A09 D193 B78F";

  const copyEmail = () => {
    navigator.clipboard.writeText(primaryEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const copyPgp = () => {
    navigator.clipboard.writeText(pgpFingerprint);
    setCopiedPgp(true);
    setTimeout(() => setCopiedPgp(false), 2200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time listener for current user's inquiries or all for admin
  useEffect(() => {
    if (!user) {
      setMyInquiries([]);
      return;
    }

    const inquiriesRef = collection(db, 'inquiries');
    const q = isAdmin 
      ? inquiriesRef 
      : query(inquiriesRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyInquiries(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      }
    );

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      await signInWithGoogle();
      return;
    }

    if (!inquirySubject.trim() || !inquiryMessage.trim()) return;

    setSubmittingInquiry(true);
    setInquiryError(null);

    const inquiryId = `inq_${Date.now()}`;
    const payload = {
      id: inquiryId,
      userId: user.uid,
      userEmail: user.email || 'anonymous@oei.dev',
      subject: inquirySubject.trim(),
      message: inquiryMessage.trim(),
      projectCategory: inquiryCategory,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'inquiries', inquiryId), payload);
      setInquirySuccessId(inquiryId);
      setInquirySubject('');
      setInquiryMessage('');
      setTimeout(() => setInquirySuccessId(null), 5000);
    } catch (err: any) {
      console.error('Inquiry submission failed:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, 'inquiries');
      } catch (fErr: any) {
        setInquiryError('Submission error: ' + (err.message || 'Permissions denied'));
      }
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <footer id="contact" className={`w-full mt-16 pb-24 scroll-mt-6 border-t pt-12 ${
      isNova ? 'border-rose-950/60' : 'border-indigo-100/70'
    }`}>
      
      {/* Contact Grid Card Container */}
      <div className={`rounded-3xl p-6 sm:p-10 border transition-all ${
        isNova 
          ? 'bg-[#101117] border-rose-900/30 shadow-lg shadow-rose-950/20' 
          : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-md shadow-indigo-100/40'
      }`}>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Callout and profile pitch (7 cols) */}
          <div className="lg:col-span-7">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isNova 
                ? 'bg-rose-950/60 text-rose-300 border-rose-800/40' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-2xs'
            }`}>
              Get in Touch & Cloud Inquiries
            </span>
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 ${
              isNova ? 'text-white' : 'text-[#0F172A]'
            }`}>
              Let's engineer secure mobile futures together.
            </h3>
            <p className={`text-sm mt-2 max-w-xl leading-relaxed ${
              isNova ? 'text-rose-100/70' : 'text-slate-600'
            }`}>
              Available for Android security consulting, FIDO2/Passkey integrations, 
              Samsung Knox TEE hardening, and high-performance edge AI system design.
            </p>

            {/* Quick Contact Links */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${primaryEmail}`}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-95 ${
                  isNova
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 shadow-rose-950/60 hover:brightness-110'
                    : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-110 shadow-indigo-300/40'
                }`}
              >
                <Mail className="w-4 h-4 text-amber-200" />
                <span>Send Direct Email</span>
              </a>

              <button
                onClick={copyEmail}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all active:scale-95 border ${
                  isNova
                    ? 'bg-[#151620] hover:bg-rose-950/50 text-slate-200 border-rose-900/40'
                    : 'bg-white hover:bg-indigo-50/50 text-slate-800 border-indigo-100 shadow-2xs'
                }`}
              >
                {copiedEmail ? (
                  <>
                    <Check className={`w-4 h-4 ${isNova ? 'text-rose-400' : 'text-emerald-600'}`} />
                    <span className={isNova ? 'text-rose-300' : 'text-emerald-700'}>Email Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowPgpModal(true)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl text-xs font-semibold border transition-all active:scale-95 ${
                  isNova
                    ? 'bg-[#151620] hover:bg-rose-950/50 text-slate-200 border-rose-900/40'
                    : 'bg-white hover:bg-indigo-50/50 text-slate-700 border-indigo-100 shadow-2xs'
                }`}
              >
                <Key className="w-4 h-4 text-amber-500" />
                <span>PGP Key</span>
              </button>
            </div>

            {/* Live Firestore Inquiry Form */}
            <div className={`mt-8 p-5 sm:p-6 rounded-2xl border ${
              isNova ? 'bg-[#0E0F16] border-rose-950/70' : 'bg-slate-50/90 border-indigo-100/80 shadow-inner'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                  Direct Project Inquiry (Persisted to Firestore)
                </span>
                {user ? (
                  <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Verified: {user.displayName || user.email?.split('@')[0]}
                  </span>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    disabled={isSigningIn}
                    type="button"
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 disabled:opacity-60"
                  >
                    <LogIn className={`w-3 h-3 ${isSigningIn ? 'animate-spin' : ''}`} />
                    {isSigningIn ? 'Opening Google...' : 'Sign in to track replies'}
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitInquiry} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Project / Discussion Topic"
                      value={inquirySubject}
                      onChange={(e) => setInquirySubject(e.target.value)}
                      required
                      minLength={3}
                      maxLength={200}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                  </div>
                  <div>
                    <select
                      value={inquiryCategory}
                      onChange={(e) => setInquiryCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    >
                      <option value="mobile-security">Mobile Security & Knox TEE</option>
                      <option value="ai-development">On-Device Edge AI / NPU</option>
                      <option value="knox-passkey">FIDO2 / Passkey Integration</option>
                      <option value="vpn-dns">Sovereign VPN & Anycast DNS</option>
                      <option value="general">General Collaboration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your requirements or architectural challenge..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    required
                    minLength={5}
                    maxLength={2000}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Stored in Firestore with zero-trust validation
                  </span>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${submittingInquiry ? 'animate-spin' : ''}`} />
                    <span>{submittingInquiry ? 'Saving to Firestore...' : user ? 'Send Inquiry' : 'Sign In & Send'}</span>
                  </button>
                </div>

                {inquirySuccessId && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Inquiry saved to Firestore! Ref: <strong className="font-mono">{inquirySuccessId}</strong></span>
                  </div>
                )}

                {inquiryError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                    {inquiryError}
                  </div>
                )}
              </form>

              {/* Show live inquiries for the user */}
              {myInquiries.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    {isAdmin ? "Admin Inbox (Live Firestore Stream)" : "Your Submitted Inquiries:"}
                  </span>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {myInquiries.map((inq) => (
                      <div key={inq.id} className="p-2.5 rounded-xl bg-white border border-slate-200/70 text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 truncate max-w-[200px]">{inq.subject}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{inq.projectCategory} • {inq.userEmail}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Verified Connect Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Domain Card */}
            <a
              href={`https://${customDomain}`}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                isNova
                  ? 'bg-[#14151F] hover:bg-rose-950/40 border-rose-950/70 hover:border-rose-800/60'
                  : 'bg-white/80 hover:bg-white border-indigo-100/80 hover:border-indigo-300 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs transition-colors ${
                  isNova
                    ? 'bg-rose-950/80 border-rose-800/50 text-rose-300 group-hover:bg-rose-600 group-hover:text-white'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white'
                }`}>
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Custom Sovereign Portal
                  </span>
                  <span className={`text-xs sm:text-sm font-mono font-bold ${
                    isNova ? 'text-white group-hover:text-rose-300' : 'text-slate-900 group-hover:text-indigo-600'
                  }`}>
                    {customDomain}
                  </span>
                </div>
              </div>
              <ExternalLink className={`w-4 h-4 transition-colors ${
                isNova ? 'text-slate-400 group-hover:text-rose-400' : 'text-slate-400 group-hover:text-indigo-600'
              }`} />
            </a>

            {/* Email Card */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border ${
              isNova
                ? 'bg-[#14151F] border-rose-950/70'
                : 'bg-white/80 border-indigo-100/80 shadow-2xs'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs ${
                  isNova
                    ? 'bg-rose-950/80 border-rose-800/50 text-rose-300'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Primary Correspondence
                  </span>
                  <span className={`text-xs sm:text-sm font-mono font-bold select-all ${
                    isNova ? 'text-white' : 'text-slate-900'
                  }`}>
                    {primaryEmail}
                  </span>
                </div>
              </div>
              <button 
                onClick={copyEmail}
                className={`p-2 rounded-xl transition-colors ${
                  isNova
                    ? 'text-slate-400 hover:text-white hover:bg-rose-950/60'
                    : 'text-slate-400 hover:text-indigo-700 hover:bg-indigo-50'
                }`}
                title="Copy email"
              >
                {copiedEmail ? <Check className={`w-4 h-4 ${isNova ? 'text-rose-400' : 'text-emerald-600'}`} /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* LinkedIn Card */}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                isNova
                  ? 'bg-[#14151F] hover:bg-rose-950/40 border-rose-950/70 hover:border-rose-800/60'
                  : 'bg-white/80 hover:bg-white border-indigo-100/80 hover:border-indigo-300 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs transition-colors ${
                  isNova
                    ? 'bg-rose-950/80 border-rose-800/50 text-rose-300 group-hover:bg-rose-600 group-hover:text-white'
                    : 'bg-blue-50 text-blue-700 border-blue-100 group-hover:bg-blue-600 group-hover:text-white'
                }`}>
                  <Linkedin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Professional Network
                  </span>
                  <span className={`text-xs sm:text-sm font-bold ${
                    isNova ? 'text-white group-hover:text-rose-300' : 'text-slate-900 group-hover:text-blue-700'
                  }`}>
                    Omar El Imarath
                  </span>
                </div>
              </div>
              <ExternalLink className={`w-4 h-4 transition-colors ${
                isNova ? 'text-slate-400 group-hover:text-rose-400' : 'text-slate-400 group-hover:text-blue-700'
              }`} />
            </a>

          </div>

        </div>

        {/* Bottom Metadata & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All systems operational • Firebase Auth & Firestore live</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© 2026 Omar El Imarath</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-950 transition-colors font-sans font-semibold"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* PGP Fingerprint Modal */}
      {showPgpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <h4 className="font-bold text-slate-900 text-sm">Public PGP Key Fingerprint</h4>
              </div>
              <button
                onClick={() => setShowPgpModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3">
              Use this fingerprint to verify cryptographic signatures or encrypt confidential disclosures.
            </p>

            <div className="mt-3 p-3 bg-slate-900 rounded-xl text-cyan-400 font-mono text-xs select-all break-all">
              {pgpFingerprint}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={copyPgp}
                className="px-4 py-2 bg-[#0F172A] text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                {copiedPgp ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Fingerprint</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Fingerprint</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
