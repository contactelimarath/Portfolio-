interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
}

const SYSTEM_INSTRUCTION = `You are the portfolio assistant for Omar El Imarath.
Be accurate, concise and technically clear. Describe only the technical interests and project areas represented on this portfolio:
- Android security: Android Credential Manager, passkeys, FIDO2, Kotlin and hardware-backed key storage.
- Network privacy: WireGuard, encrypted DNS (DoH/DoT) and privacy-oriented network architecture.
- Software and AI: TypeScript, Cloudflare Workers, web application engineering and Gemini API integration.
Contact: contact.elimarath@gmail.com. LinkedIn: https://linkedin.com/in/omar-el-imarath.
Do not invent certifications, clients, customer engagements, measured performance, security audit results or completed deployments. If a detail is not established, say so.`;

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
    return "The portfolio explores Android Credential Manager, Kotlin and hardware-backed authentication for passwordless FIDO2 passkeys. Specific implementation status should be checked against the linked source code.";
  }
  if (query.includes("vpn") || query.includes("dns") || query.includes("network")) {
    return "The OEI network architecture area focuses on WireGuard-based encrypted networking and privacy-oriented DNS using DoH/DoT. Ask about a specific component for more detail.";
  }
  if (query.includes("contact") || query.includes("hire") || query.includes("email")) {
    return "You can contact Omar at contact.elimarath@gmail.com or connect on LinkedIn at https://linkedin.com/in/omar-el-imarath.";
  }
  if (query.includes("skill") || query.includes("stack") || query.includes("technology")) {
    return "The portfolio highlights Android and Kotlin, application security, passkeys/FIDO2, TypeScript, Cloudflare Workers and AI integration.";
  }
  return "I can explain the portfolio's Android security, network privacy and applied AI project areas, or help you find the right way to contact Omar.";
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
  if (body.message.length > 8000) return json({ error: "Message is too long" }, 413);

  const history = Array.isArray(body.history)
    ? body.history.slice(-6).flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const entry = item as { role?: unknown; text?: unknown };
        if ((entry.role !== "user" && entry.role !== "model") || typeof entry.text !== "string") return [];
        return [{ role: entry.role, parts: [{ text: entry.text.slice(0, 3000) }] }];
      })
    : [];

  if (env.GEMINI_API_KEY) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);
      let response: Response;
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL || "gemini-3.8-flash")}:generateContent`,
          {
            method: "POST",
            headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
              contents: [...history, { role: "user", parts: [{ text: body.message }] }],
              generationConfig: { maxOutputTokens: 900, temperature: 0.4 },
            }),
            signal: controller.signal,
          },
        );
      } finally {
        clearTimeout(timeout);
      }

      if (response.ok) {
        const result = await response.json() as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const reply = result.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
        if (reply) return json({ reply, source: env.GEMINI_MODEL || "gemini-3.8-flash" });
      }
    } catch {
      // Fall through to the deterministic local assistant response.
    }
  }

  return json({ reply: localReply(body.message), source: "portfolio-fallback" });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return request.method === "GET"
        ? json({ ok: true, service: "portfolio-api", aiConfigured: Boolean(env.GEMINI_API_KEY) })
        : json({ error: "Method not allowed" }, 405);
    }

    if (url.pathname === "/api/chat") return handleChat(request, env);

    if (url.pathname === "/api/metrics") {
      return request.method === "GET"
        ? json({ published: false, message: "Live performance metrics are not published until independently verified." })
        : json({ error: "Method not allowed" }, 405);
    }

    if (url.pathname.startsWith("/api/")) return json({ error: "Not found" }, 404);
    return env.ASSETS.fetch(request);
  },
};
