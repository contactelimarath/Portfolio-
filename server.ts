import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System instruction about Omar El Imarath
const OMAR_SYSTEM_INSTRUCTION = `
You are the personal AI Assistant for Omar El Imarath's interactive portfolio and technical dashboard.
About Omar El Imarath:
- Title: AI Developer & Mobile Security Specialist
- Core Capabilities:
  1. Mobile Security & Android Architecture: Passkey / WebAuthn, FIDO2, Android Credential Manager API, Material 3 Jetpack Compose UI, Samsung Knox TEE integration, BiometricPrompt, StrongBox KeyStore, ProGuard/R8 obfuscation, and zero-leak mobile network layers.
  2. Security & Privacy Systems: "OEI VPN & DNS Architecture" - Custom sovereign WireGuard tunnel infrastructure, encrypted DNS-over-HTTPS (DoH) / DNS-over-TLS (DoT) recursive resolvers, hardware killswitch logic, and Deep Packet Inspection (DPI) evasion.
  3. Security Project Lifecycle (Phases 01-06):
     - Phase 01: Threat Modeling & TEE Attack Surface Analysis (STRIDE, Knox sandbox)
     - Phase 02: Cryptographic Architecture & Keystore Isolation (FIDO2, ECDSA P-256 in StrongBox)
     - Phase 03: Kernel Tunneling & Sovereign DNS Infrastructure (WireGuard, oeielite.dpdns.org)
     - Phase 04: Material 3 UI & Android Credential Manager Integration (S24PasskeyScreen.kt)
     - Phase 05: Fuzzing, Penetration Testing & Binary Obfuscation (R8/DexGuard, anti-tampering)
     - Phase 06: Continuous Remote Attestation & Fleet Monitoring (Play Integrity, 99.98% SLA)
  4. AI & Intelligent Agents: Edge model deployment (Snapdragon NPU / MediaTek APU), Gemini 3.8/3.1 integration, prompt engineering, multi-turn reasoning pipelines, and contextual automated workflows.
- Contact Details:
  - Email: contact.elimarath@gmail.com
  - Domain / Security Hub: oeielite.dpdns.org
  - LinkedIn: https://linkedin.com/in/omar-el-imarath
  - Status: Active Developer, open to cutting-edge contracts, security audits, and senior AI/mobile architecture roles.

Personality & Tone:
- Professional, technically authoritative, sharp, concise, and helpful.
- Provide clear answers with architectural details or snippets when asked about Kotlin, Passkeys, VPN encryption (ChaCha20-Poly1305, Curve25519), or Omar's availability.
`;

// AI Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (ai) {
      try {
        // Construct conversation contents with history if provided
        const contents: any[] = [];
        
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item.role === 'user' || item.role === 'model') {
              contents.push({
                role: item.role,
                parts: [{ text: item.text }],
              });
            }
          }
        }
        
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: OMAR_SYSTEM_INSTRUCTION,
          },
        });

        const reply = response.text || "I am currently monitoring Omar's security pipeline. Feel free to reach out directly at contact.elimarath@gmail.com.";
        res.json({ reply, source: 'gemini-3.8-flash' });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, providing intelligent local response:', geminiError?.message);
      }
    }

    // Context-aware fallback response generator
    const query = message.toLowerCase();
    let reply = "";

    if (query.includes('passkey') || query.includes('s24') || query.includes('kotlin')) {
      reply = "Omar engineered the 'S24PasskeyScreen.kt' Material 3 implementation using Android's Credential Manager API and Samsung Knox TEE. It provides biometric hardware-backed FIDO2 authentication with zero password exchange, cryptographic challenge verification, and instant fallback.";
    } else if (query.includes('lifecycle') || query.includes('timeline') || query.includes('phase')) {
      reply = "Omar's security project lifecycle spans 6 hardened phases: Phase 01 (Threat Modeling & TEE Analysis), Phase 02 (Cryptographic Architecture & StrongBox Keystore), Phase 03 (Kernel Tunneling & Sovereign DNS), Phase 04 (Material 3 Compose UI), Phase 05 (Fuzzing, Pentesting & Obfuscation), and Phase 06 (Continuous Remote Attestation). Check the new vertical timeline in the Showcase section!";
    } else if (query.includes('vpn') || query.includes('dns') || query.includes('security') || query.includes('oei')) {
      reply = "The 'OEI VPN & DNS Architecture' is Omar's sovereign privacy asset suite. It combines custom WireGuard kernel tunnels (ChaCha20-Poly1305), an anycast DNS-over-HTTPS resolver at oeielite.dpdns.org with ad/tracker sinkholing, and automated failover killswitch mechanics.";
    } else if (query.includes('contact') || query.includes('hire') || query.includes('email') || query.includes('reach')) {
      reply = "You can contact Omar directly via email at contact.elimarath@gmail.com, access his custom portal at oeielite.dpdns.org, or connect via LinkedIn. He is currently marked as an Active Developer available for high-impact AI and mobile security initiatives.";
    } else if (query.includes('stack') || query.includes('skill') || query.includes('tech') || query.includes('language')) {
      reply = "Omar specializes in Kotlin (Jetpack Compose, Coroutines, Flow), Android NDK/C++, Material 3 design systems, Hardware Keystore / Knox TEE, WireGuard protocol, DNS privacy (DoH/DoT), Node.js/TypeScript, and Gemini / Edge AI acceleration.";
    } else {
      reply = `Hello! I am Omar's Portfolio AI assistant. Omar is an AI Developer and Mobile Security Specialist. Explore his featured work like "S24PasskeyScreen.kt" and the "OEI VPN & DNS Architecture" below, or send an inquiry to contact.elimarath@gmail.com!`;
    }

    res.json({ reply, source: 'portfolio-engine' });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to process assistant request' });
  }
});

// Real-time metrics endpoint
app.get('/api/metrics', (_req: Request, res: Response) => {
  res.json({
    securityProjects: 24,
    activeApps: 8,
    codeRepositories: 142,
    systemHealth: 98.4,
    securityScore: 99,
    activeStatus: 'Active Developer',
    email: 'contact.elimarath@gmail.com',
    domain: 'oeielite.dpdns.org',
    dnsPingMs: 14,
    lastAuditDate: '2026-11-01',
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (dev mode: ${isDev})`);
  });
}

startServer();
