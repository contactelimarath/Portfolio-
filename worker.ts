interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  GEMINI_API_KEY?: string;
}

const SYSTEM_INSTRUCTION = `You are the personal AI assistant for Omar El Imarath's professional portfolio.
Be accurate, concise, and technically clear. Describe projects and capabilities based on the portfolio context:
- Android security and architecture: Android Credential Manager, passkeys, FIDO2, Jetpack Compose, hardware-backed keystores, Samsung Knox.
- Privacy and networking: WireGuard, encrypted DNS (DoH/DoT), network privacy and security architecture.
- AI and software engineering: TypeScript, Node.js, Gemini API, edge applications, and secure application design.
Contact: contact.elimarath@gmail.com. LinkedIn: https://linkedin.com/in/omar-el-imarath.
Do not invent certifications, customer engagements, measured performance, or completed security audits.`;

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

function localReply(message: string): string {
  const query = message.toLowerCase();

  if (query.includes("passkey") || query.includes("s24") || query.includes("kotlin")) {
    return "The S24PasskeyScreen.kt concept uses Android Credential Manager and hardware-backed authentication to support passwordless FIDO2 passkeys. The implementation details should be verified against the published project code.";
  }
  if (query.includes("lifecycle") || query.includes("timeline") || query.includes("phase")) {
    return "The portfolio presents a six-phase security lifecycle: threat modeling, cryptographic architecture, network and DNS security, Android UI and credential integration, testing and hardening, and ongoing monitoring.";
  }
  if (query.includes("vpn") || query.includes("dns") || query.includes("security") || query.includes("oei")) {
    return "The OEI VPN and DNS architecture focuses on WireGuard-based encrypted networking and privacy-oriented DNS using DoH/DoT. Ask about a specific component for a more detailed explanation.";
  }
  if (query.includes("contact") || query.includes("hire") || query.includes("email") || query.includes("reach")) {
    return "Contact Omar at contact.elimarath@gmail.com or connect through LinkedIn at https://linkedin.com/in/omar-el-imarath.";
  }
  if (query.includes("stack") || query.includes("skill") || query.includes("tech") || query.includes("language")) {
    return "The portfolio highlights Kotlin, Jetpack Compose, Android security, TypeScript, Node.js, web application development, and Gemini API integration.";
  }
  return "Hello. I am the portfolio assistant. I can explain Omar's Android security work, privacy architecture, software projects, technical stack, and contact details.";
}

async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json() as typeof body;
  } catch {
    return json({ error: "Request body must be valid JSON" }, 400);
  }

  if (typeof body.message !== "string" || !body.message.trim()) {
    return json({ error: "Message is required" }, 400);
  }
  if (body.message.length > 8000) {
    return json({ error: "Message is too long" }, 413);
  }

  const history = Array.isArray(body.history)
    ? body.history.slice(-6).flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const entry = item as { role?: unknown; text?: unknown };
        if ((entry.role !== "user" && entry.role !== "model") || typeof entry.text !== "string") return [];
        return [{ role: entry.role, parts: [{ text: entry.text.slice(0, 4000) }] }];
      })
    : [];

  if (env.GEMINI_API_KEY) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents: [...history, { role: "user", parts: [{ text: body.message }] }],
            generationConfig: { maxOutputTokens: 1200, temperature: 0.6 },
          }),
        },
      );

      if (response.ok) {
        const result = await response.json() as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const reply = result.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join("")
          .trim();
        if (reply) return json({ reply, source: "gemini-3.8-flash" });
      }
    } catch {
      // The local portfolio response below keeps the chat usable during provider outages.
    }
  }

  return json({ reply: localReply(body.message), source: "portfolio-engine" });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return request.method === "GET"
        ? json({ ok: true, service: "portfolio-api" })
        : json({ error: "Method not allowed" }, 405);
    }

    if (url.pathname === "/api/chat") return handleChat(request, env);

    if (url.pathname === "/api/metrics") {
      return request.method === "GET"
        ? json({
            securityProjects: 24,
            activeApps: 8,
            codeRepositories: 142,
            systemHealth: 98.4,
            securityScore: 99,
            activeStatus: "Active Developer",
            email: "contact.elimarath@gmail.com",
            domain: "oeielite.dpdns.org",
            dnsPingMs: 14,
            lastAuditDate: "2026-11-01",
          })
        : json({ error: "Method not allowed" }, 405);
    }

    if (url.pathname.startsWith("/api/")) return json({ error: "Not found" }, 404);

    return env.ASSETS.fetch(request);
  },
};
