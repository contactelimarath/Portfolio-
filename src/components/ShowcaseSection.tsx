import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Shield, 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Fingerprint, 
  Lock, 
  Key, 
  Wifi, 
  Server, 
  Download, 
  Zap,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  Cpu,
  Bot,
  AlertTriangle,
  Sliders,
  Gauge,
  CheckCircle2,
  Filter,
  Star
} from 'lucide-react';
import { SecurityLifecycleTimeline } from './SecurityLifecycleTimeline.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';

export type ProjectDomain = 'all' | 'ai' | 'security';
export type ShowcaseTab = 'passkey' | 'vpn' | 'lifecycle' | 'edge-ai' | 'copilot';

export const ShowcaseSection: React.FC = () => {
  const { theme } = useTheme();
  const isNova = theme === 'nova-crimson';
  const { user, signInWithGoogle } = useAuth();

  // Firestore Saved Bookmarks State
  const [bookmarkedProjectIds, setBookmarkedProjectIds] = useState<string[]>([]);
  const [bookmarking, setBookmarking] = useState(false);

  // Domain Filter: 'all', 'ai' (AI Development), 'security' (Mobile Security)
  const [domainFilter, setDomainFilter] = useState<ProjectDomain>('all');
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('passkey');

  // Real-time Firestore listener for bookmarked projects
  useEffect(() => {
    if (!user) {
      setBookmarkedProjectIds([]);
      return;
    }

    const q = query(collection(db, 'bookmarks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ids = snapshot.docs.map(doc => doc.data().projectId as string);
        setBookmarkedProjectIds(ids);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bookmarks');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const toggleBookmark = async (projId: string) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }

    setBookmarking(true);
    const bookmarkDocId = `${user.uid}_${projId}`;
    const isCurrentlyBookmarked = bookmarkedProjectIds.includes(projId);

    try {
      if (isCurrentlyBookmarked) {
        await deleteDoc(doc(db, 'bookmarks', bookmarkDocId));
      } else {
        await setDoc(doc(db, 'bookmarks', bookmarkDocId), {
          id: bookmarkDocId,
          userId: user.uid,
          projectId: projId,
          notes: 'Saved from portfolio showcase',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Bookmark error:', err);
      handleFirestoreError(err, isCurrentlyBookmarked ? OperationType.DELETE : OperationType.CREATE, 'bookmarks');
    } finally {
      setBookmarking(false);
    }
  };

  // S24 Passkey Interactive State
  const [passkeyState, setPasskeyState] = useState<'idle' | 'prompt' | 'verifying' | 'success'>('idle');
  const [activeCodeFile, setActiveCodeFile] = useState<'screen' | 'vault' | 'manifest'>('screen');
  const [copiedCode, setCopiedCode] = useState(false);

  // VPN & DNS Architecture State
  const [killswitchActive, setKillswitchActive] = useState(true);
  const [dnsTestRunning, setDnsTestRunning] = useState(false);
  const [dnsTestResult, setDnsTestResult] = useState<{
    latency: number;
    dnssec: boolean;
    leaks: boolean;
    blockedTelemetry: number;
  } | null>({
    latency: 14,
    dnssec: true,
    leaks: false,
    blockedTelemetry: 14892,
  });
  const [copiedWgConfig, setCopiedWgConfig] = useState(false);

  // AI Development State: Edge Neural Engine
  const [edgeQuantization, setEdgeQuantization] = useState<'int4' | 'int8' | 'fp16'>('int4');
  const [edgeHardware, setEdgeHardware] = useState<'npu' | 'gpu' | 'cpu'>('npu');
  const [edgeInferenceRunning, setEdgeInferenceRunning] = useState(false);
  const [edgeTokensStream, setEdgeTokensStream] = useState<string>('');
  const [edgeMetrics, setEdgeMetrics] = useState({
    tokPerSec: 58.4,
    latencyFirstTokenMs: 82,
    memoryMb: 1140,
    powerWatts: 2.1
  });

  // AI Development State: Security Copilot
  const [copilotScenario, setCopilotScenario] = useState<'keystore' | 'cleartext' | 'receiver'>('keystore');
  const [copilotAuditing, setCopilotAuditing] = useState(false);
  const [copilotAuditDone, setCopilotAuditDone] = useState(true);
  const [activeAiCodeFile, setActiveAiCodeFile] = useState<'edge-engine' | 'copilot-agent'>('edge-engine');

  const handleDomainFilterChange = (filter: ProjectDomain) => {
    setDomainFilter(filter);
    if (filter === 'ai') {
      if (activeTab === 'passkey' || activeTab === 'vpn' || activeTab === 'lifecycle') {
        setActiveTab('edge-ai');
      }
    } else if (filter === 'security') {
      if (activeTab === 'edge-ai' || activeTab === 'copilot') {
        setActiveTab('passkey');
      }
    }
  };

  const triggerPasskeyAuth = () => {
    setPasskeyState('prompt');
  };

  const completeBiometric = () => {
    setPasskeyState('verifying');
    setTimeout(() => {
      setPasskeyState('success');
      setTimeout(() => {
        setPasskeyState('idle');
      }, 3500);
    }, 1100);
  };

  const runDnsPingTest = () => {
    setDnsTestRunning(true);
    setTimeout(() => {
      setDnsTestResult({
        latency: Math.floor(12 + Math.random() * 6),
        dnssec: true,
        leaks: false,
        blockedTelemetry: 14892 + Math.floor(Math.random() * 15),
      });
      setDnsTestRunning(false);
    }, 900);
  };

  const runEdgeInferenceDemo = () => {
    setEdgeInferenceRunning(true);
    setEdgeTokensStream('');
    const fullText = "Executing local quantized inference via Android AICore... Memory mapped into Knox protected buffer. Verified zero cloud leakage: Output generated in 184ms with 58 tok/s.";
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setEdgeTokensStream((prev) => prev + fullText.charAt(currentIndex));
        currentIndex += 3;
      } else {
        clearInterval(interval);
        setEdgeInferenceRunning(false);
      }
    }, 35);
  };

  const runCopilotAudit = () => {
    setCopilotAuditing(true);
    setTimeout(() => {
      setCopilotAuditing(false);
      setCopilotAuditDone(true);
    }, 850);
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const downloadWgConfig = () => {
    const blob = new Blob([wireguardConfigCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oei-wireguard.conf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const kotlinPasskeyScreenCode = `/**
 * S24PasskeyScreen.kt
 * Material 3 Jetpack Compose implementation for Galaxy S24 series.
 * Integrates Android Credential Manager API & Samsung Knox TEE Attestation.
 * Author: Omar El Imarath (AI Developer & Mobile Security Specialist)
 */
package org.oeielite.security.auth

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetPublicKeyCredentialOption
import kotlinx.coroutines.launch

@Composable
fun S24PasskeyScreen(
    credentialManager: CredentialManager,
    onAuthSuccess: (userHandle: ByteArray) -> Unit,
    onAuthError: (Throwable) -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    var isAuthenticating by remember { mutableStateOf(false) }
    var knoxAttestationStatus by remember { mutableStateOf("TEE Hardware Ready") }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.surface
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            KnoxSecurityBadge(status = knoxAttestationStatus)

            Card(
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Fingerprint,
                        contentDescription = "Passkey Biometric",
                        modifier = Modifier.size(56.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "FIDO2 Passwordless Entry",
                        style = MaterialTheme.typography.titleLarge
                    )
                    Text(
                        text = "Hardware-backed ECDSA P-256 via StrongBox",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    Button(
                        onClick = {
                            coroutineScope.launch {
                                isAuthenticating = true
                                executePasskeyAssertion(credentialManager, onAuthSuccess, onAuthError)
                                isAuthenticating = false
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Text("Authenticate with Passkey")
                    }
                }
            }
            SecurityFooter()
        }
    }
}`;

  const knoxVaultCode = `/**
 * KnoxSecurityVault.kt
 * Samsung Knox TEE hardware-backed attestation and KeyStore keystore manager.
 */
package org.oeielite.security.vault

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.security.KeyPairGenerator
import java.security.KeyStore

class KnoxSecurityVault {
    private val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }

    fun generateKnoxHardwareKey(alias: String) {
        val keyPairGenerator = KeyPairGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_EC,
            "AndroidKeyStore"
        )
        val spec = KeyGenParameterSpec.Builder(
            alias,
            KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY
        )
        .setDigests(KeyProperties.DIGEST_SHA256, KeyProperties.DIGEST_SHA512)
        .setUserAuthenticationRequired(true)
        .setUserAuthenticationParameters(
            0, // Requires biometric per authentication
            KeyProperties.AUTH_BIOMETRIC_STRONG
        )
        .setIsStrongBoxBacked(true) // Knox StrongBox TEE
        .build()

        keyPairGenerator.initialize(spec)
        keyPairGenerator.generateKeyPair()
    }
}`;

  const manifestCode = `<!-- AndroidManifest.xml: Hardware Biometric & Credential Features -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="org.oeielite.security">

    <uses-feature android:name="android.hardware.fingerprint" android:required="true" />
    <uses-feature android:name="android.hardware.strongbox_keystore" android:required="false" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="OEI Knox Passkey Suite"
        android:networkSecurityConfig="@xml/network_security_config"
        android:allowBackup="false">
    </application>
</manifest>`;

  const wireguardConfigCode = `# OEI Sovereign WireGuard & DNS Profile
# Host: oeielite.dpdns.org (Anycast Resolver)
# Zero-Leak VPN & Ad/Tracker Sinkhole

[Interface]
PrivateKey = [CLIENT_KNOX_PRIVATE_KEY_25519]
Address = 10.88.0.4/32, fd88::4/128
DNS = 10.88.0.1, 2606:4700::6810:f822
MTU = 1420

[Peer]
PublicKey = 7gB9KxV2mQpWv8+LzX1...=
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = oeielite.dpdns.org:51820
PersistentKeepalive = 25`;

  const geminiEdgeEngineCode = `/**
 * GeminiEdgeEngine.kt
 * On-Device Neural Acceleration via Android AICore & NNAPI.
 * Features INT4 quantization, zero-cloud offloading, and memory isolation.
 * Author: Omar El Imarath (AI Developer & Mobile Security Specialist)
 */
package org.oeielite.ai.edge

import android.content.Context
import androidx.annotation.WorkerThread
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.nio.ByteBuffer
import java.nio.channels.FileChannel

class GeminiEdgeEngine(private val context: Context) {
    private var neuralContextHandle: Long = 0L
    private val quantizationMode = QuantizationProfile.INT4_WEIGHTS

    fun initializeNpuPipeline(): Boolean {
        // Direct hardware mapping to Samsung Exynos / Snapdragon NPU
        neuralContextHandle = NativeAICoreBridge.initHardwareContext(
            accelerationType = "NPU",
            cacheSizeMb = 1200,
            useKnoxIsolation = true
        )
        return neuralContextHandle != 0L
    }

    @WorkerThread
    fun streamTokenGeneration(prompt: String): Flow<String> = flow {
        val inputTokens = Tokenizer.encode(prompt)
        val tensorInput = ByteBuffer.allocateDirect(inputTokens.size * 4)
        
        NativeAICoreBridge.executeQuantizedStream(
            handle = neuralContextHandle,
            input = tensorInput,
            onTokenEmitted = { tokenString ->
                emit(tokenString) // Yielding token to Compose state machine
            }
        )
    }
}`;

  const securityCopilotAgentCode = `/**
 * SecurityCopilotAgent.kt
 * Autonomous AST security scanner running on-device via quantized LLM.
 * Detects hardcoded keys, insecure cryptographic algorithms, and leaky intents.
 */
package org.oeielite.ai.copilot

import org.oeielite.ai.edge.GeminiEdgeEngine
import java.io.File

class SecurityCopilotAgent(private val edgeEngine: GeminiEdgeEngine) {

    data class SecurityVulnerability(
        val cveId: String,
        val severity: Severity,
        val affectedSnippet: String,
        val recommendedFix: String
    )

    enum class Severity { CRITICAL, HIGH, MEDIUM, LOW }

    suspend fun auditKotlinSource(sourceContent: String): List<SecurityVulnerability> {
        val astTokens = parseAbstractSyntaxTree(sourceContent)
        // Passes AST representation to Edge Gemini model for adversarial audit
        val rawAuditResponse = edgeEngine.streamTokenGeneration(
            prompt = "Analyze following AST for Android cryptographic and IPC vulnerabilities: " + astTokens
        )
        return parseRemediationRules(rawAuditResponse)
    }
}`;

  return (
    <section id="showcase" className="w-full mt-12 scroll-mt-6">
      {/* Section Header with Domain Filter & Tab Switchers */}
      <div className="flex flex-col gap-5 mb-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                isNova 
                  ? 'text-rose-300 bg-rose-950/60 border-rose-800/40' 
                  : 'text-indigo-700 bg-indigo-50 border-indigo-200/80 shadow-2xs'
              }`}>
                Featured Implementations
              </span>
              <span className={`text-xs font-mono hidden sm:inline ${isNova ? 'text-rose-400/60' : 'text-slate-400'}`}>
                Interactive Sandbox
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 ${
              isNova ? 'text-white' : 'text-[#0F172A]'
            }`}>
              Interactive Showcase
            </h2>
            <p className={`text-sm mt-1 ${isNova ? 'text-rose-200/70' : 'text-slate-600'}`}>
              Filter between production on-device AI engineering and zero-trust mobile security architectures.
            </p>
          </div>

          {/* PRIMARY DOMAIN FILTER: AI Development vs Mobile Security */}
          <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 self-start sm:self-auto shadow-sm ${
            isNova ? 'bg-[#12131A] border-rose-950/70' : 'bg-white/90 border-indigo-100/90 shadow-indigo-100/30'
          }`}>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-2 pr-1 hidden md:inline flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-400" /> Filter:
            </span>

            <button
              onClick={() => handleDomainFilterChange('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                domainFilter === 'all'
                  ? (isNova
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs'
                      : 'bg-[#0F172A] text-white shadow-xs')
                  : (isNova ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
              }`}
            >
              <span>All</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                domainFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>5</span>
            </button>

            <button
              onClick={() => handleDomainFilterChange('ai')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                domainFilter === 'ai'
                  ? (isNova
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-300/40')
                  : (isNova ? 'text-slate-400 hover:text-rose-300' : 'text-slate-600 hover:text-indigo-900')
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Development</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                domainFilter === 'ai' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
              }`}>2</span>
            </button>

            <button
              onClick={() => handleDomainFilterChange('security')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                domainFilter === 'security'
                  ? (isNova
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200/50')
                  : (isNova ? 'text-slate-400 hover:text-rose-300' : 'text-slate-600 hover:text-emerald-900')
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-cyan-200" />
              <span>Mobile Security</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                domainFilter === 'security' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>3</span>
            </button>
          </div>
        </div>

        {/* Secondary Project Tabs & Firestore Bookmark Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={`inline-flex flex-wrap p-1.5 rounded-2xl border shadow-inner self-start gap-1 ${
            isNova ? 'bg-[#12131A] border-rose-950/60' : 'bg-slate-200/70 border-slate-300/70'
          }`}>
            {/* AI Tab 1: Edge Neural Engine */}
            {(domainFilter === 'all' || domainFilter === 'ai') && (
              <button
                onClick={() => setActiveTab('edge-ai')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'edge-ai'
                    ? (isNova 
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' 
                        : 'bg-white text-indigo-950 shadow-md font-bold')
                    : (isNova ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-indigo-900')
                }`}
              >
                <Cpu className={`w-4 h-4 ${isNova ? 'text-rose-300' : 'text-violet-600'}`} />
                <span>GeminiEdgeEngine.kt</span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 font-bold hidden sm:inline">
                  AI
                </span>
              </button>
            )}

            {/* AI Tab 2: Security Copilot Agent */}
            {(domainFilter === 'all' || domainFilter === 'ai') && (
              <button
                onClick={() => setActiveTab('copilot')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'copilot'
                    ? (isNova 
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' 
                        : 'bg-white text-indigo-950 shadow-md font-bold')
                    : (isNova ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-indigo-900')
                }`}
              >
                <Bot className={`w-4 h-4 ${isNova ? 'text-rose-300' : 'text-indigo-600'}`} />
                <span>SecurityCopilot.kt</span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 font-bold hidden sm:inline">
                  AI Agent
                </span>
              </button>
            )}

            {/* Security Tab 1: S24 Passkey */}
            {(domainFilter === 'all' || domainFilter === 'security') && (
              <button
                onClick={() => setActiveTab('passkey')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'passkey'
                    ? (isNova 
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' 
                        : 'bg-white text-indigo-950 shadow-md font-bold')
                    : (isNova ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-indigo-900')
                }`}
              >
                <Smartphone className={`w-4 h-4 ${isNova ? 'text-rose-200' : 'text-indigo-600'}`} />
                <span>S24PasskeyScreen.kt</span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold hidden sm:inline">
                  Knox
                </span>
              </button>
            )}

            {/* Security Tab 2: OEI VPN & DNS */}
            {(domainFilter === 'all' || domainFilter === 'security') && (
              <button
                onClick={() => setActiveTab('vpn')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'vpn'
                    ? (isNova 
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' 
                        : 'bg-white text-indigo-950 shadow-md font-bold')
                    : (isNova ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-indigo-900')
                }`}
              >
                <Shield className={`w-4 h-4 ${isNova ? 'text-rose-200' : 'text-emerald-600'}`} />
                <span>OEI VPN & DNS</span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold hidden sm:inline">
                  Network
                </span>
              </button>
            )}

            {/* Security Tab 3: Lifecycle Timeline */}
            {(domainFilter === 'all' || domainFilter === 'security') && (
              <button
                onClick={() => setActiveTab('lifecycle')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'lifecycle'
                    ? (isNova 
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' 
                        : 'bg-white text-indigo-950 shadow-md font-bold')
                    : (isNova ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-indigo-900')
                }`}
              >
                <Layers className={`w-4 h-4 ${isNova ? 'text-rose-200' : 'text-purple-600'}`} />
                <span>Lifecycle Timeline</span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold hidden sm:inline">
                  Audit
                </span>
              </button>
            )}
          </div>

          {/* Firestore Real-Time Bookmark Toggle */}
          <button
            onClick={() => toggleBookmark(activeTab)}
            disabled={bookmarking}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all active:scale-95 shadow-2xs ${
              bookmarkedProjectIds.includes(activeTab)
                ? 'bg-amber-50 border-amber-200 text-amber-800 font-bold'
                : (isNova ? 'bg-[#151620] border-rose-900/40 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50')
            }`}
            title="Save this project implementation to your Firestore bookmarks"
          >
            <Star className={`w-3.5 h-3.5 ${
              bookmarkedProjectIds.includes(activeTab)
                ? 'fill-amber-400 text-amber-500'
                : 'text-slate-400'
            }`} />
            <span>{bookmarkedProjectIds.includes(activeTab) ? 'Bookmarked in Firestore' : 'Bookmark Project'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AI DEVELOPMENT TAB 1: GeminiEdgeEngine.kt (Edge Neural NPU Pipeline) */}
      {/* ========================================================================= */}
      {activeTab === 'edge-ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Interactive NPU Benchmark & Simulator (Left 5 cols) */}
          <div className={`lg:col-span-5 rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.012] hover:shadow-xl ${
            isNova
              ? 'bg-[#101117] border-rose-900/30 shadow-lg shadow-rose-950/20'
              : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-md shadow-indigo-100/40'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isNova ? 'text-rose-300' : 'text-indigo-700'
                }`}>
                  On-Device NPU Benchmark
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border bg-indigo-50 text-indigo-700 border-indigo-200/80">
                  Android AICore • INT4
                </span>
              </div>

              {/* Hardware Selection Pills */}
              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Compute Accelerator
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'npu', label: 'Galaxy S24 NPU', speed: '58 tok/s' },
                    { id: 'gpu', label: 'Vulkan GPU', speed: '34 tok/s' },
                    { id: 'cpu', label: 'CPU Fallback', speed: '12 tok/s' }
                  ].map((hw) => (
                    <button
                      key={hw.id}
                      onClick={() => setEdgeHardware(hw.id as any)}
                      className={`p-2 rounded-xl text-left border transition-all duration-200 hover:scale-[1.02] ${
                        edgeHardware === hw.id
                          ? (isNova ? 'bg-rose-950/80 border-rose-600 text-white' : 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs')
                          : 'bg-white/50 border-slate-200/70 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-bold block truncate">{hw.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">{hw.speed}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantization Switcher */}
              <div className="mb-5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Weight Quantization Format
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'int4', label: 'INT4 (Recommended • 1.2 GB)' },
                    { id: 'int8', label: 'INT8 (2.4 GB)' },
                    { id: 'fp16', label: 'FP16 (4.8 GB)' }
                  ].map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setEdgeQuantization(q.id as any)}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-mono font-semibold border transition-all duration-200 hover:scale-[1.02] ${
                        edgeQuantization === q.id
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-xs'
                          : 'bg-white/60 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {q.id.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 transition-all duration-200 hover:scale-[1.025] hover:shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Throughput</span>
                  <p className="text-base font-extrabold font-mono text-indigo-600 mt-0.5">
                    {edgeHardware === 'npu' ? '58.4 tok/s' : edgeHardware === 'gpu' ? '34.2 tok/s' : '12.8 tok/s'}
                  </p>
                  <p className="text-[10px] text-slate-500">Zero network bottleneck</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 transition-all duration-200 hover:scale-[1.025] hover:shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Time to 1st Token</span>
                  <p className="text-base font-extrabold font-mono text-emerald-600 mt-0.5">
                    {edgeHardware === 'npu' ? '82 ms' : edgeHardware === 'gpu' ? '146 ms' : '310 ms'}
                  </p>
                  <p className="text-[10px] text-slate-500">Instant offline response</p>
                </div>
              </div>

              {/* Live Neural Token Stream Container */}
              <div className="rounded-2xl p-3.5 bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 min-h-[95px] flex flex-col justify-between transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    On-Device AICore Session
                  </span>
                  <span>100% Offline</span>
                </div>
                <p className="my-2 text-[11px] leading-relaxed text-indigo-200">
                  {edgeTokensStream || "Click 'Run On-Device Prompt' below to execute neural token generation without transmitting any telemetry to the cloud."}
                </p>
                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>Context: Knox Memory Enclave</span>
                  <span>Safety: Tier 1</span>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-4">
              <button
                onClick={runEdgeInferenceDemo}
                disabled={edgeInferenceRunning}
                className="w-full py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-300/40 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Play className={`w-3.5 h-3.5 ${edgeInferenceRunning ? 'animate-spin' : ''}`} />
                <span>{edgeInferenceRunning ? 'Generating Tokens on NPU...' : 'Run On-Device Prompt'}</span>
              </button>
            </div>
          </div>

          {/* Source Code Viewer (Right 7 cols) */}
          <div className={`lg:col-span-7 rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.012] hover:shadow-xl ${
            isNova
              ? 'bg-[#101117] border-rose-900/30 shadow-lg shadow-rose-950/20'
              : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-md shadow-indigo-100/40'
          }`}>
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-semibold">
                    GeminiEdgeEngine.kt
                  </span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    Android AICore NPU Driver
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(geminiEdgeEngineCode, setCopiedCode)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all active:scale-95"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code block */}
              <div className="mt-4 bg-[#0F172A] rounded-2xl p-4 text-indigo-300 font-mono text-xs overflow-x-auto max-h-[380px] shadow-inner border border-slate-800">
                <pre className="leading-relaxed">
                  <code>{geminiEdgeEngineCode}</code>
                </pre>
              </div>
            </div>

            {/* AI Architecture Highlights */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="p-2.5 rounded-2xl bg-white/80 border border-indigo-100/70 shadow-2xs transition-all duration-200 hover:scale-[1.025] hover:shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Model Type</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Gemini Nano / Local LLM</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Sub-2B parameter mobile model</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/80 border border-indigo-100/70 shadow-2xs transition-all duration-200 hover:scale-[1.025] hover:shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Acceleration</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Android AICore NNAPI</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Direct DMA buffer mapping</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/80 border border-indigo-100/70 shadow-2xs transition-all duration-200 hover:scale-[1.025] hover:shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Privacy SLA</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">0 Cloud Packets</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Air-gapped Knox sandbox</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Domain: AI Development & Edge ML</span>
              <button
                onClick={() => setActiveTab('copilot')}
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-sans font-bold"
              >
                <span>View Security Copilot Agent →</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* AI DEVELOPMENT TAB 2: SecurityCopilot.kt (Autonomous Code Auditor) */}
      {/* ========================================================================= */}
      {activeTab === 'copilot' && (
        <div className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 hover:scale-[1.008] hover:shadow-xl ${
          isNova 
            ? 'bg-[#101117] border-rose-900/30 shadow-lg shadow-rose-950/20' 
            : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-md shadow-indigo-100/40'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-50">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200/80">
                  Autonomous AI Agent
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Model: On-Device AST Guard
                </span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-1 ${
                isNova ? 'text-white' : 'text-[#0F172A]'
              }`}>
                Security Copilot Agent
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Real-time abstract syntax tree (AST) code vulnerability analyzer that identifies cryptographic flaws, 
                insecure KeyStore configurations, and broadcast leaks with instant AI remediation diffs.
              </p>
            </div>

            {/* Test Trigger */}
            <button
              onClick={runCopilotAudit}
              disabled={copilotAuditing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-2xl shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              <Bot className={`w-4 h-4 ${copilotAuditing ? 'animate-spin' : ''}`} />
              <span>{copilotAuditing ? 'AI Auditing Bytecode...' : 'Trigger Copilot Audit'}</span>
            </button>
          </div>

          {/* Interactive Scenario Selector */}
          <div className="mt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Select Vulnerability Scenario:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'keystore',
                  title: 'Insecure KeyStore Alias',
                  cve: 'CWE-320',
                  severity: 'HIGH',
                  desc: 'Key generated without StrongBox TEE hardware isolation flag.'
                },
                {
                  id: 'cleartext',
                  title: 'Cleartext Socket Transmission',
                  cve: 'CWE-319',
                  severity: 'CRITICAL',
                  desc: 'Android network security config permits non-TLS HTTP communication.'
                },
                {
                  id: 'receiver',
                  title: 'Exported Intent Leak',
                  cve: 'CWE-926',
                  severity: 'MEDIUM',
                  desc: 'BroadcastReceiver registered without permission signature protection.'
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setCopilotScenario(item.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    copilotScenario === item.id
                      ? 'bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-200/50 shadow-sm'
                      : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-50 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : item.severity === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                  <span className="text-[10px] font-mono text-indigo-700 font-bold block mt-2">{item.cve}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Remediation Diff Output */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Detected Vulnerable Code */}
            <div className="rounded-2xl p-4 bg-slate-900 text-slate-300 font-mono text-xs border border-slate-800 transition-all duration-200 hover:scale-[1.01]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-red-400 font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Vulnerable AST Input Detected
                </span>
                <span>Flagged by Copilot</span>
              </div>
              <pre className="mt-3 leading-relaxed text-red-200/90 overflow-x-auto text-[11px]">
                <code>
                  {copilotScenario === 'keystore' && `// INSECURE: Default Keymaster allows software fallback\nval spec = KeyGenParameterSpec.Builder(alias, PURPOSE_SIGN)\n    .setDigests(DIGEST_SHA256)\n    // Missing: .setIsStrongBoxBacked(true)\n    .build()`}
                  {copilotScenario === 'cleartext' && `<!-- INSECURE: Network config allows plain HTTP -->\n<network-security-config>\n    <base-config cleartextTrafficPermitted="true" />\n</network-security-config>`}
                  {copilotScenario === 'receiver' && `<!-- INSECURE: Exported without permission guard -->\n<receiver android:name=".AuthTokenReceiver"\n    android:exported="true">\n    <!-- Any malicious app can inject intents -->\n</receiver>`}
                </code>
              </pre>
            </div>

            {/* AI Generated Remediation */}
            <div className="rounded-2xl p-4 bg-slate-900 text-slate-300 font-mono text-xs border border-slate-800 transition-all duration-200 hover:scale-[1.01]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-emerald-400 font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AI Suggested Hardened Patch
                </span>
                <span>Instant Auto-Fix</span>
              </div>
              <pre className="mt-3 leading-relaxed text-emerald-200/90 overflow-x-auto text-[11px]">
                <code>
                  {copilotScenario === 'keystore' && `// HARDENED: Enforces Knox StrongBox hardware TEE\nval spec = KeyGenParameterSpec.Builder(alias, PURPOSE_SIGN)\n    .setDigests(DIGEST_SHA256, DIGEST_SHA512)\n    .setUserAuthenticationRequired(true)\n    .setIsStrongBoxBacked(true) // Knox StrongBox TEE\n    .build()`}
                  {copilotScenario === 'cleartext' && `<!-- HARDENED: Disallows plain traffic entirely -->\n<network-security-config>\n    <base-config cleartextTrafficPermitted="false">\n        <trust-anchors><certificates src="system" /></trust-anchors>\n    </base-config>\n</network-security-config>`}
                  {copilotScenario === 'receiver' && `<!-- HARDENED: Signature-level permission only -->\n<receiver android:name=".AuthTokenReceiver"\n    android:exported="false"\n    android:permission="org.oeielite.permission.KNOX_AUTH">\n</receiver>`}
                </code>
              </pre>
            </div>

          </div>

          {/* Bottom Copilot Meta */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-mono">
            <span>Audit Model: Quantized Gemini Nano AST Engine (0ms network round-trip)</span>
            <button
              onClick={() => copyToClipboard(securityCopilotAgentCode, setCopiedCode)}
              className="inline-flex items-center gap-1.5 text-indigo-600 font-sans font-bold hover:text-indigo-900"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy SecurityCopilotAgent.kt Code</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE SECURITY TAB 1: S24PasskeyScreen.kt Showcase */}
      {/* ========================================================================= */}
      {activeTab === 'passkey' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Interactive Mobile Device Simulator (Left 5 cols) */}
          <div className={`lg:col-span-5 rounded-3xl p-6 border flex flex-col items-center transition-all duration-300 hover:scale-[1.012] hover:shadow-xl ${
            isNova
              ? 'bg-[#101117] border-rose-900/30 shadow-lg shadow-rose-950/20'
              : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-md shadow-indigo-100/40'
          }`}>
            <div className="w-full flex items-center justify-between mb-4">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isNova ? 'text-rose-300' : 'text-slate-500'
              }`}>
                Interactive S24 Simulator
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                isNova 
                  ? 'bg-rose-950/60 text-rose-300 border-rose-800/40' 
                  : 'text-indigo-700 bg-indigo-50 border-indigo-200/80'
              }`}>
                One UI 6.1 • Knox 3.10
              </span>
            </div>

            {/* Galaxy S24 Device Frame */}
            <div className="w-full max-w-[290px] aspect-[9/18.5] bg-slate-950 rounded-[44px] p-2.5 shadow-2xl border-[4px] border-slate-700/80 relative overflow-hidden flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02]">
              
              {/* Phone Status Bar & Punch-hole camera */}
              <div className="w-full pt-1 px-4 flex items-center justify-between text-[11px] text-white/80 font-medium z-10">
                <span>9:41</span>
                {/* Camera dot */}
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700/80"></div>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Screen Inner Container */}
              <div className={`flex-1 rounded-[36px] my-1 p-4 flex flex-col justify-between relative overflow-hidden ${
                isNova 
                  ? 'bg-gradient-to-b from-[#2A0812] via-[#1A0A10] to-[#0A0B0E] text-white' 
                  : 'bg-gradient-to-b from-[#EFF3FC] via-[#F6F8FD] to-[#FFFFFF] text-slate-900'
              }`}>
                
                {/* Ambient glow in phone screen */}
                {isNova ? (
                  <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-rose-600/30 to-transparent pointer-events-none"></div>
                ) : (
                  <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-indigo-200/40 via-pink-100/20 to-transparent pointer-events-none"></div>
                )}

                {/* Knox Security Banner */}
                <div className={`rounded-2xl p-2.5 flex items-center gap-2 border ${
                  isNova
                    ? 'bg-rose-950/60 border-rose-800/40'
                    : 'bg-white/90 border-indigo-100 shadow-2xs'
                }`}>
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isNova ? 'bg-rose-600 text-white' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xs'
                  }`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className={`text-[11px] font-bold leading-tight ${isNova ? 'text-white' : 'text-slate-900'}`}>
                      Knox Vault Enclave
                    </p>
                    <p className={`text-[9px] font-medium ${isNova ? 'text-rose-300' : 'text-indigo-600'}`}>
                      StrongBox Hardware Attested
                    </p>
                  </div>
                </div>

                {/* Center Content */}
                <div className="text-center my-auto py-2 relative z-10">
                  <div className="relative inline-block mx-auto mb-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner ${
                      isNova
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-800/50 shadow-[0_0_20px_rgba(225,29,72,0.4)]'
                        : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 border border-indigo-200/60 shadow-xs'
                    }`}>
                      <Fingerprint className="w-9 h-9" />
                    </div>
                    {passkeyState === 'verifying' && (
                      <span className={`absolute inset-0 rounded-full border-2 animate-ping ${
                        isNova ? 'border-rose-500' : 'border-indigo-500'
                      }`}></span>
                    )}
                  </div>

                  <h4 className={`text-sm font-extrabold ${isNova ? 'text-white' : 'text-[#0F172A]'}`}>
                    {passkeyState === 'idle' && "Authenticate with Passkey"}
                    {passkeyState === 'prompt' && "Touch Fingerprint Sensor"}
                    {passkeyState === 'verifying' && "Validating Knox Challenge..."}
                    {passkeyState === 'success' && "Knox Passkey Verified!"}
                  </h4>
                  <p className={`text-[10px] mt-1 px-2 ${isNova ? 'text-rose-200/70' : 'text-slate-500'}`}>
                    {passkeyState === 'idle' && "Passwordless cryptographic login for Omar's secure suite."}
                    {passkeyState === 'prompt' && "Click the sensor below to complete biometric assertion."}
                    {passkeyState === 'verifying' && "Verifying ECDSA P-256 signature in hardware TEE."}
                    {passkeyState === 'success' && "Assertion valid. FIDO2 token issued with 0 plain secrets."}
                  </p>

                  {/* Biometric Clickable Prompt */}
                  {passkeyState === 'prompt' && (
                    <button
                      onClick={completeBiometric}
                      className="mt-4 w-full py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-300/50 flex items-center justify-center gap-1.5 animate-bounce active:scale-95"
                    >
                      <Fingerprint className="w-4 h-4" />
                      <span>Simulate Touch (Biometric)</span>
                    </button>
                  )}

                  {passkeyState === 'success' && (
                    <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border ${
                      isNova 
                        ? 'bg-rose-950 text-rose-300 border-rose-800' 
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>
                      <Check className="w-3 h-3 text-emerald-600" />
                      ECDSA Assertion 200 OK
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  {passkeyState === 'idle' && (
                    <button
                      onClick={triggerPasskeyAuth}
                      className={`w-full py-2.5 text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        isNova
                          ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:brightness-110 shadow-rose-950/60'
                          : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-110 shadow-md shadow-indigo-300/40'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5 text-amber-200" />
                      <span>Launch Biometric Flow</span>
                    </button>
                  )}
                  {passkeyState !== 'idle' && passkeyState !== 'prompt' && (
                    <button
                      onClick={() => setPasskeyState('idle')}
                      className={`w-full py-2 text-xs font-semibold rounded-2xl transition-colors ${
                        isNova 
                          ? 'bg-rose-950/60 text-rose-200 hover:bg-rose-900/60' 
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      Reset Simulator
                    </button>
                  )}
                </div>

              </div>

              {/* Gesture Home Bar */}
              <div className="w-full pb-1 flex justify-center">
                <div className="w-24 h-1 bg-white/40 rounded-full"></div>
              </div>

            </div>

            <p className="text-[11px] text-slate-400 text-center mt-4">
              Tip: Click "Launch Biometric Flow" to test live Knox challenge resolution.
            </p>
          </div>

          {/* Source Code Viewer (Right 7 cols) */}
          <div className={`lg:col-span-7 rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 hover:scale-[1.012] hover:shadow-xl ${
            isNova
              ? 'bg-[#101117] border-rose-900/30 shadow-lg shadow-rose-950/20'
              : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-md shadow-indigo-100/40'
          }`}>
            <div>
              {/* File switcher tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveCodeFile('screen')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                      activeCodeFile === 'screen'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    S24PasskeyScreen.kt
                  </button>
                  <button
                    onClick={() => setActiveCodeFile('vault')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                      activeCodeFile === 'vault'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    KnoxSecurityVault.kt
                  </button>
                  <button
                    onClick={() => setActiveCodeFile('manifest')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                      activeCodeFile === 'manifest'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    AndroidManifest.xml
                  </button>
                </div>

                <button
                  onClick={() => {
                    const code = activeCodeFile === 'screen' 
                      ? kotlinPasskeyScreenCode 
                      : activeCodeFile === 'vault' 
                      ? knoxVaultCode 
                      : manifestCode;
                    copyToClipboard(code, setCopiedCode);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all active:scale-95"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code display block */}
              <div className="mt-4 bg-[#0F172A] rounded-2xl p-4 text-slate-300 font-mono text-xs overflow-x-auto max-h-[380px] shadow-inner border border-slate-800">
                <pre className="leading-relaxed">
                  <code>
                    {activeCodeFile === 'screen' && kotlinPasskeyScreenCode}
                    {activeCodeFile === 'vault' && knoxVaultCode}
                    {activeCodeFile === 'manifest' && manifestCode}
                  </code>
                </pre>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="p-2.5 rounded-2xl bg-white/80 border border-indigo-100/70 shadow-2xs transition-all duration-200 hover:scale-[1.025] hover:shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Standard</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">FIDO2 / WebAuthn</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Passwordless authentication</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/80 border border-indigo-100/70 shadow-2xs transition-all duration-200 hover:scale-[1.025] hover:shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Hardware</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">StrongBox TEE</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Samsung Knox key enclave</p>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/80 border border-indigo-100/70 shadow-2xs transition-all duration-200 hover:scale-[1.025] hover:shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Compose</span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Material 3 UI</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Modern Jetpack reactive state</p>
              </div>
            </div>

            {/* Quick link to timeline */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Project Phase 04: Compose UI & BiometricPrompt
              </span>
              <button
                onClick={() => setActiveTab('lifecycle')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>View Full Lifecycle Timeline</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE SECURITY TAB 2: OEI VPN & DNS Architecture */}
      {/* ========================================================================= */}
      {activeTab === 'vpn' && (
        <div className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 hover:scale-[1.008] hover:shadow-xl ${
          isNova 
            ? 'bg-[#101117] border-rose-900/30 shadow-lg shadow-rose-950/20' 
            : 'bg-white/85 backdrop-blur-xl border-white/90 shadow-md shadow-indigo-100/40'
        }`}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-50">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isNova 
                    ? 'bg-rose-950/60 text-rose-300 border-rose-800/40' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
                }`}>
                  Sovereign Privacy Suite
                </span>
                <span className={`text-xs font-mono ${isNova ? 'text-rose-300/60' : 'text-slate-500'}`}>
                  Node: oeielite.dpdns.org
                </span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-1 ${
                isNova ? 'text-white' : 'text-[#0F172A]'
              }`}>
                OEI VPN & DNS Architecture
              </h3>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${
                isNova ? 'text-rose-200/70' : 'text-slate-600'
              }`}>
                High-performance WireGuard tunnel paired with custom recursive DNS-over-HTTPS (DoH) / DNS-over-TLS (DoT) 
                sinkhole filters to eliminate tracking and ISP surveillance.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={downloadWgConfig}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all border ${
                  isNova 
                    ? 'bg-[#151620] border-rose-900/40 text-slate-200 hover:bg-rose-950/40' 
                    : 'bg-white border-indigo-100 text-slate-800 hover:bg-indigo-50/50 shadow-2xs'
                }`}
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>Download .conf</span>
              </button>
              <a
                href="https://oeielite.dpdns.org"
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all shadow-sm ${
                  isNova 
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:brightness-110 shadow-rose-950/50' 
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110 shadow-indigo-300/40'
                }`}
              >
                <span>Gateway Status</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
              </a>
            </div>
          </div>

          {/* Interactive Topology Diagram */}
          <div className={`mt-8 rounded-2xl p-6 border relative overflow-hidden ${
            isNova ? 'bg-[#0E0F16] border-rose-950/80' : 'bg-[#F8F9FD] border-indigo-100/70'
          }`}>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4">
              Zero-Trust Topology Map
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              
              {/* Node 1 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 relative transition-all duration-200 hover:scale-[1.03] hover:shadow-md cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-slate-900">1. Mobile Client</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Galaxy S24 / Linux Station</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                  10.88.0.4/32
                </span>
              </div>

              {/* Node 2 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 relative transition-all duration-200 hover:scale-[1.03] hover:shadow-md cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                  <Lock className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-slate-900">2. WireGuard Tunnel</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">ChaCha20-Poly1305 AEAD</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  MTU 1420 • Kernel Module
                </span>
              </div>

              {/* Node 3 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 relative transition-all duration-200 hover:scale-[1.03] hover:shadow-md cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                  <Server className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-slate-900">3. Sovereign Anycast DNS</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">oeielite.dpdns.org</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                  DoH/DoT • DNSSEC Validated
                </span>
              </div>

              {/* Node 4 */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 relative transition-all duration-200 hover:scale-[1.03] hover:shadow-md cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                  <Shield className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-slate-900">4. Sinkhole & DPI Shield</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">Ad/Tracker/Telemetry Drop</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  14.8k Rules Blocked
                </span>
              </div>

            </div>
          </div>

          {/* Interactive Controls & Live Diagnostics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Killswitch & Live Leak Prevention */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 flex flex-col justify-between transition-all duration-200 hover:scale-[1.015] hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Fail-Safe Hardware Killswitch
                  </span>
                  <button
                    onClick={() => setKillswitchActive(!killswitchActive)}
                    className={`w-11 h-6 rounded-full transition-colors p-1 relative flex items-center ${
                      killswitchActive ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        killswitchActive ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  When active, iptables routes DROP all non-tunneled outgoing packets if WireGuard handshake expires. 
                  Zero unencrypted fallback.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Leak Protection Status:</span>
                <span className={`font-bold ${killswitchActive ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {killswitchActive ? 'ARMED (Zero-Leak)' : 'DISARMED'}
                </span>
              </div>
            </div>

            {/* Live DNS Diagnostic Ping */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 flex flex-col justify-between transition-all duration-200 hover:scale-[1.015] hover:shadow-md">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-cyan-600" />
                    Real-time DNS & Ping Diagnostic
                  </span>
                  <button
                    onClick={runDnsPingTest}
                    disabled={dnsTestRunning}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${dnsTestRunning ? 'animate-spin' : ''}`} />
                    <span>Test Ping</span>
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-white p-2 rounded-xl border border-slate-200/60 transition-all duration-200 hover:scale-[1.02]">
                    <span className="text-[10px] text-slate-400 block">Latency</span>
                    <span className="font-bold text-cyan-700">{dnsTestResult?.latency} ms</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/60 transition-all duration-200 hover:scale-[1.02]">
                    <span className="text-[10px] text-slate-400 block">DNSSEC</span>
                    <span className="font-bold text-emerald-600">VALIDATED</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/60 transition-all duration-200 hover:scale-[1.02]">
                    <span className="text-[10px] text-slate-400 block">Plain Leaks</span>
                    <span className="font-bold text-emerald-600">0 (SECURE)</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200/60 transition-all duration-200 hover:scale-[1.02]">
                    <span className="text-[10px] text-slate-400 block">Telemetry Blocked</span>
                    <span className="font-bold text-purple-700">{dnsTestResult?.blockedTelemetry.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                Resolver test queried via DNS-over-HTTPS to oeielite.dpdns.org
              </p>
            </div>

          </div>

          {/* WireGuard Config Preview */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
                wg0-oei-client.conf
              </span>
              <button
                onClick={() => copyToClipboard(wireguardConfigCode, setCopiedWgConfig)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
              >
                {copiedWgConfig ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Config</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Config</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-[#0F172A] rounded-2xl p-4 text-cyan-400 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
              <code>{wireguardConfigCode}</code>
            </pre>
          </div>

          {/* Quick link banner to lifecycle timeline */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Trace this architecture across the complete project lifecycle:
            </span>
            <button
              onClick={() => setActiveTab('lifecycle')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Inspect Security Lifecycle Timeline</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE SECURITY TAB 3: Security Project Lifecycle Timeline */}
      {/* ========================================================================= */}
      {activeTab === 'lifecycle' && (
        <SecurityLifecycleTimeline />
      )}

    </section>
  );
};
