import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Terminal, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  Activity, 
  Server, 
  Sparkles, 
  Layers,
  Bug,
  Radio,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface TimelineStage {
  id: string;
  phaseNumber: string;
  title: string;
  subtitle: string;
  category: 'threat' | 'crypto' | 'network' | 'ui' | 'audit' | 'ops';
  status: 'Completed' | 'Continuous' | 'Hardened';
  statusColor: string;
  dateRange: string;
  icon: React.ElementType;
  summary: string;
  keyDeliverables: string[];
  securityPrimitives: string[];
  metrics: { label: string; value: string }[];
  details: string;
}

export const SecurityLifecycleTimeline: React.FC = () => {
  const { theme } = useTheme();
  const isNova = theme === 'nova-crimson';

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'crypto' | 'network' | 'audit'>('all');
  const [expandedStage, setExpandedStage] = useState<string>('stage-4'); // Default open S24 Passkey phase

  const stages: TimelineStage[] = [
    {
      id: 'stage-1',
      phaseNumber: 'PHASE 01',
      title: 'Threat Modeling & TEE Attack Surface Analysis',
      subtitle: 'STRIDE modeling, physical bus sniffing mitigations, and Knox boundary design',
      category: 'threat',
      status: 'Completed',
      statusColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dateRange: 'Architecture Kickoff',
      icon: Shield,
      summary: 'Rigorous architectural threat mapping targeting mobile hardware enclaves, kernel inter-process communications, and untrusted network transport vectors.',
      keyDeliverables: [
        'STRIDE mobile threat matrix documentation',
        'TrustZone & Knox boundary isolation criteria',
        'Hardware bus sniffing & fault injection countermeasures'
      ],
      securityPrimitives: ['Samsung Knox TEE', 'ARM TrustZone', 'Memory Safety Boundaries'],
      metrics: [
        { label: 'Identified Attack Vectors', value: '42 Covered' },
        { label: 'Threat Mitigation Rate', value: '100%' }
      ],
      details: 'Evaluates the hardware boundary between the Rich Execution Environment (Android OS) and the Secure World (Knox TEE). Enforces zero-trust trustlets for handling cryptographic credentials and key pairs.'
    },
    {
      id: 'stage-2',
      phaseNumber: 'PHASE 02',
      title: 'Cryptographic Architecture & Keystore Isolation',
      subtitle: 'StrongBox hardware-backed key generation, ECDSA P-256, and AEAD tunnels',
      category: 'crypto',
      status: 'Hardened',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dateRange: 'Cryptographic Core',
      icon: Key,
      summary: 'Design and implementation of non-exportable cryptographic primitives anchored directly within dedicated StrongBox hardware security chips.',
      keyDeliverables: [
        'FIDO2 / WebAuthn cryptographic challenge engine',
        'ECDSA P-256 StrongBox KeyStore integration',
        'ChaCha20-Poly1305 symmetric tunnel key rotation'
      ],
      securityPrimitives: ['ECDSA P-256', 'Curve25519', 'SHA-512', 'StrongBox Keymaster'],
      metrics: [
        { label: 'Key Exportability', value: '0 (Non-exportable)' },
        { label: 'Hardware Enclave', value: 'Level 4 StrongBox' }
      ],
      details: 'Ensures that private keys never enter OS application memory. All digital signatures for passkey authentication are performed directly on dedicated hardware with biometric authentication user-presence verification.'
    },
    {
      id: 'stage-3',
      phaseNumber: 'PHASE 03',
      title: 'Kernel Tunneling & Sovereign DNS Infrastructure',
      subtitle: 'WireGuard kernel routing, fail-safe killswitch, and Anycast DoH resolvers',
      category: 'network',
      status: 'Hardened',
      statusColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      dateRange: 'Infrastructure Layer',
      icon: Server,
      summary: 'End-to-end sovereign networking stack engineered to defeat deep packet inspection, ISP snooping, and telemetry exfiltration.',
      keyDeliverables: [
        'Hardened WireGuard kernel module deployment',
        'Anycast recursive DNS-over-HTTPS resolver at oeielite.dpdns.org',
        'iptables zero-leak emergency killswitch daemon'
      ],
      securityPrimitives: ['WireGuard AEAD', 'DNSSEC Validation', 'DoH / DoT', 'Sinkhole DPI'],
      metrics: [
        { label: 'Resolver Latency', value: '14 ms Anycast' },
        { label: 'Telemetry Sinkholed', value: '14,892 Domains' }
      ],
      details: 'Routes all mobile outbound sockets via encrypted WireGuard tunnels. Outbound DNS inquiries are resolved recursively by sovereign server nodes with DNSSEC cryptographic record verification.'
    },
    {
      id: 'stage-4',
      phaseNumber: 'PHASE 04',
      title: 'Material 3 UI & Android Credential Manager Integration',
      subtitle: 'S24PasskeyScreen.kt, Jetpack Compose, and BiometricPrompt state machine',
      category: 'ui',
      status: 'Completed',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      dateRange: 'Client Experience',
      icon: Cpu,
      summary: 'Production-ready Material 3 Jetpack Compose user experience connecting frictionless biometric UX with hardware-attested passkey challenge flows.',
      keyDeliverables: [
        'S24PasskeyScreen.kt Material 3 Compose implementation',
        'Android Credential Manager API orchestration',
        'BiometricPrompt hardware sensor lifecycle handler'
      ],
      securityPrimitives: ['CredentialManager', 'BiometricStrong', 'Hardware Passkeys', 'Material 3'],
      metrics: [
        { label: 'Biometric Auth Speed', value: '< 240 ms' },
        { label: 'User Friction Drop', value: '-85% vs passwords' }
      ],
      details: 'Provides the visual interface showcased in S24PasskeyScreen.kt. Replaces passwords with seamless touch biometric authorization backed by Knox hardware attestation tokens.'
    },
    {
      id: 'stage-5',
      phaseNumber: 'PHASE 05',
      title: 'Fuzzing, Penetration Testing & Binary Obfuscation',
      subtitle: 'R8 dictionary rules, Frida hook prevention, and zero-day vulnerability audit',
      category: 'audit',
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dateRange: 'Audit & Hardening',
      icon: Bug,
      summary: 'Adversarial red-team testing, dynamic instrumentation counteraction, native binary stripping, and zero-CVE signoff verification.',
      keyDeliverables: [
        'ProGuard & R8 aggressive symbol renaming dictionary',
        'Frida / Xposed runtime hook & root detection heuristics',
        'Automated static and dynamic taint analysis report'
      ],
      securityPrimitives: ['Anti-Debugging', 'DexGuard Obfuscation', 'ELF Native Strip', '0 CVE SLA'],
      metrics: [
        { label: 'Known CVEs', value: '0 Vulnerabilities' },
        { label: 'Hooking Resistance', value: 'Tier 1 Pass' }
      ],
      details: 'Simulates hostile rooted environments where malicious actors attempt memory injection. The application detects debugger attachment and runtime hooks, terminating sensitive cryptographic sessions immediately.'
    },
    {
      id: 'stage-6',
      phaseNumber: 'PHASE 06',
      title: 'Continuous Remote Attestation & Fleet Monitoring',
      subtitle: 'Remote Key Attestation (RKA), DNSSEC rotation, and high-availability telemetry',
      category: 'ops',
      status: 'Continuous',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
      dateRange: 'Production Fleet',
      icon: Radio,
      summary: 'Real-time telemetry and cryptographic attestation verification guaranteeing device integrity across global client deployments.',
      keyDeliverables: [
        'Google Play Integrity / Remote Key Attestation validation',
        'Automated DNSSEC KSK / ZSK key rotation on oeielite.dpdns.org',
        'Real-time uptime heartbeat and alert pipelines'
      ],
      securityPrimitives: ['Play Integrity API', 'RKA Certificate Chain', '99.98% Uptime SLA'],
      metrics: [
        { label: 'Fleet Availability', value: '99.98% SLA' },
        { label: 'Attestation Validity', value: '100% Hardware Attested' }
      ],
      details: 'Continuous cloud-to-device verification pipeline. Devices provide signed cryptographic attestation certificates prior to receiving sensitive enterprise access grants.'
    }
  ];

  const filteredStages = stages.filter((stage) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'crypto') return stage.category === 'crypto' || stage.category === 'threat';
    if (selectedFilter === 'network') return stage.category === 'network';
    if (selectedFilter === 'audit') return stage.category === 'audit' || stage.category === 'ops';
    return true;
  });

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border transition-all ${
      isNova 
        ? 'bg-[#101117] border-rose-900/30 shadow-lg shadow-rose-950/20' 
        : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-md shadow-indigo-100/40'
    }`}>
      
      {/* Header with Title and Filter Pills */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${
        isNova ? 'border-rose-950/60' : 'border-indigo-50'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              isNova 
                ? 'bg-rose-950/60 text-rose-300 border-rose-800/40' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-2xs'
            }`}>
              Security Engineering Lifecycle
            </span>
            <span className={`text-xs font-mono ${isNova ? 'text-rose-300/60' : 'text-slate-500'}`}>
              Zero-Trust Framework
            </span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-1.5 ${
            isNova ? 'text-white' : 'text-[#0F172A]'
          }`}>
            Security Project Lifecycle & Audit Trail
          </h3>
          <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${
            isNova ? 'text-rose-200/70' : 'text-slate-600'
          }`}>
            A comprehensive, vertical visualization of Omar's end-to-end security pipeline: 
            from low-level Knox hardware threat modeling to production-grade continuous attestation.
          </p>
        </div>

        {/* Category Filters */}
        <div className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border self-start md:self-auto ${
          isNova ? 'bg-[#14151E] border-rose-950/60' : 'bg-slate-200/60 border-slate-300/60'
        }`}>
          {[
            { id: 'all', label: 'All Phases' },
            { id: 'crypto', label: 'Crypto & Threat' },
            { id: 'network', label: 'Network & DNS' },
            { id: 'audit', label: 'Audit & Fleet' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === tab.id
                  ? (isNova 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs font-bold' 
                      : 'bg-white text-indigo-950 shadow-md font-bold')
                  : (isNova ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-indigo-900')
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Vertical Timeline Container */}
      <div className="mt-8 relative pl-4 sm:pl-8">
        
        {/* Continuous Connecting Vertical Line */}
        <div className={`absolute left-[19px] sm:left-[35px] top-6 bottom-6 w-0.5 ${
          isNova 
            ? 'bg-gradient-to-b from-red-500 via-rose-500 to-amber-500 opacity-80 shadow-[0_0_12px_rgba(225,29,72,0.6)]' 
            : 'bg-gradient-to-b from-violet-500 via-indigo-500 to-emerald-500 opacity-70'
        }`}></div>

        {/* Timeline Items List */}
        <div className="space-y-6 sm:space-y-8">
          {filteredStages.map((stage) => {
            const Icon = stage.icon;
            const isExpanded = expandedStage === stage.id;

            return (
              <div 
                key={stage.id} 
                className="relative flex items-start gap-4 sm:gap-6 group"
              >
                {/* Timeline Node Badge / Icon */}
                <div className="relative z-10 shrink-0">
                  <div 
                    onClick={() => setExpandedStage(isExpanded ? '' : stage.id)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                      isExpanded
                        ? (isNova 
                            ? 'bg-rose-600 text-white ring-4 ring-rose-500/30 scale-105 shadow-[0_0_15px_#f43f5e]' 
                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white ring-4 ring-indigo-200/60 scale-105 shadow-md shadow-indigo-300/40')
                        : (isNova 
                            ? 'bg-[#151620] text-rose-300 border border-rose-900/50 hover:border-rose-500 hover:text-white group-hover:scale-105' 
                            : 'bg-white text-slate-700 border border-indigo-100 hover:border-indigo-400 hover:text-indigo-600 group-hover:scale-105 shadow-2xs')
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  {/* Subtle live pulse dot for ongoing/hardened phases */}
                  {stage.status === 'Continuous' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white animate-pulse"></span>
                  )}
                  {stage.status === 'Hardened' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  )}
                </div>

                {/* Content Card */}
                <div className={`flex-1 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border transition-all duration-300 hover:scale-[1.012] hover:shadow-md shadow-xs ${
                  isNova
                    ? 'bg-[#13141D] hover:bg-[#161724] border-rose-950/60 hover:border-rose-800/60'
                    : 'bg-slate-50/90 hover:bg-slate-50 border-slate-200/70 hover:border-slate-300'
                }`}>
                  
                  {/* Card Header & Toggle Bar */}
                  <div 
                    onClick={() => setExpandedStage(isExpanded ? '' : stage.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                          isNova ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {stage.phaseNumber}
                        </span>
                        <span className="text-slate-500 hidden sm:inline">•</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isNova 
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800/40' 
                            : stage.statusColor
                        }`}>
                          {stage.status}
                        </span>
                        <span className={`text-[10px] font-mono ${isNova ? 'text-slate-400' : 'text-slate-400'}`}>
                          {stage.dateRange}
                        </span>
                      </div>
                      <h4 className={`text-sm sm:text-base font-extrabold tracking-tight mt-1 transition-colors ${
                        isNova ? 'text-white group-hover:text-rose-300' : 'text-[#0F172A] group-hover:text-cyan-800'
                      }`}>
                        {stage.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                        {isExpanded ? 'Less' : 'Inspect'}
                      </span>
                      <div className={`p-1 rounded-xl border ${
                        isNova ? 'bg-[#1C1E2B] text-slate-300 border-rose-900/40' : 'bg-white text-slate-500 border-slate-200/70'
                      }`}>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                    isNova ? 'text-rose-100/70' : 'text-slate-600'
                  }`}>
                    {stage.subtitle}
                  </p>

                  {/* Summary & Metrics Preview */}
                  <div className={`mt-4 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-2 ${
                    isNova ? 'border-rose-950/60' : 'border-slate-200/60'
                  }`}>
                    {stage.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className={`p-2 sm:p-2.5 rounded-xl border shadow-2xs transition-all duration-200 hover:scale-[1.03] ${
                        isNova ? 'bg-[#0E0F16] border-rose-950/80' : 'bg-white border-slate-200/60'
                      }`}>
                        <span className="text-[10px] font-medium text-slate-400 block truncate">{metric.label}</span>
                        <span className={`text-xs font-bold font-mono mt-0.5 block ${
                          isNova ? 'text-rose-300' : 'text-slate-900'
                        }`}>{metric.value}</span>
                      </div>
                    ))}
                    <div className="col-span-2 flex flex-wrap gap-1.5 items-center justify-end">
                      {stage.securityPrimitives.map((primitive, pIdx) => (
                        <span 
                          key={pIdx}
                          className={`text-[10px] font-mono px-2 py-1 rounded-lg border ${
                            isNova 
                              ? 'bg-[#0E0F16] border-rose-950/80 text-rose-200' 
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          {primitive}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Technical Details Accordion */}
                  {isExpanded && (
                    <div className={`mt-4 pt-4 border-t animate-in fade-in slide-in-from-top-2 duration-200 space-y-4 ${
                      isNova ? 'border-rose-950/60' : 'border-slate-200/80'
                    }`}>
                      
                      {/* Deep-dive Explanation */}
                      <div className={`rounded-2xl p-4 border ${
                        isNova ? 'bg-[#0E0F16] border-rose-950/80' : 'bg-white border-slate-200/70'
                      }`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                          isNova ? 'text-rose-400' : 'text-cyan-800'
                        }`}>
                          Architectural Execution
                        </span>
                        <p className={`text-xs leading-relaxed ${isNova ? 'text-slate-300' : 'text-slate-600'}`}>
                          {stage.details}
                        </p>
                      </div>

                      {/* Key Deliverables Checkpoints */}
                      <div>
                        <span className={`text-[11px] font-bold block mb-2 ${isNova ? 'text-slate-300' : 'text-slate-700'}`}>
                          Key Deliverables & Verification Artifacts:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {stage.keyDeliverables.map((deliverable, dIdx) => (
                            <div 
                              key={dIdx} 
                              className={`p-3 rounded-xl border flex items-start gap-2 shadow-2xs transition-all duration-200 hover:scale-[1.02] ${
                                isNova 
                                  ? 'bg-[#0E0F16] border-rose-950/80 text-slate-200' 
                                  : 'bg-white border-slate-200/70 text-slate-700'
                              }`}
                            >
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                isNova ? 'text-rose-400' : 'text-emerald-600'
                              }`} />
                              <span className="text-xs font-medium leading-snug">
                                {deliverable}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Full lifecycle adherence: 100% Knox & FIDO2 Attestation verified</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Total Pipeline Duration:</span>
          <span className="font-bold text-slate-800">Sprint 01 - Sprint 10</span>
        </div>
      </div>

    </div>
  );
};
