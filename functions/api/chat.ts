interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
}
type ChatEntry = { role?: unknown; text?: unknown };

const SYSTEM_INSTRUCTION = `You are the portfolio assistant for Omar El Imarath. Be accurate, concise and technically clear. Describe only technical interests and project areas represented on the portfolio: Android Credential Manager, passkeys, FIDO2, Kotlin, hardware-backed key storage, WireGuard, encrypted DNS (DoH/DoT), TypeScript, Cloudflare Workers and applied AI. Contact: contact.elimarath@gmail.com. LinkedIn: https://linkedin.com/in/omar-el-imarath. Do not invent certifications, clients, customer engagements, measured performance, security audit results or completed deployments. If a detail is not established, say so.`;

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
  const q = message.toLowerCase();
  if (q.includes("passkey") || q.includes("s24") || q.includes("kotlin")) {
    return "The portfolio explores Android Credential Manager, Kotlin and hardware-backed authentication for passwordless FIDO2 passkeys. Specific implementation status should be checked against the linked source code.";
  }
  if (q.includes("vpn") || q.includes("dns") || q.includes("network")) {
    return "The OEI network architecture area focuses on WireGuard-based encrypted networking and privacy-oriented DNS using DoH/DoT. Ask about a specific component for more detail.";
  }
  if (q.includes("contact") || q.includes("hire") || q.includes("email")) {
    return "You can contact Omar at contact.elimarath@gmail.com or connect on LinkedIn at https://linkedin.com/in/omar-el-imarath.";
  }
  if (q.includes("skill") || q.includes("stack") || q.includes("technology")) {
    return "The portfolio highlights Android and Kotlin, application security, passkeys/FIDO2, TypeScript, Cloudflare Workers and AI integration.";
  }
  return "I can explain the portfolio's Android security, network privacy and applied AI project areas, or help you find the right way to contact Omar.";
}

function getHistory(history: unknown) {
  return Array.isArray(history)
    ? history.slice(-6).flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const entry = item as ChatEntry;
        if ((entry.role !== "user" && entry.role !== "model") || typeof entry.text !== "string") return [];
        return [{
          role: entry.role === "model" ? "assistant" : "user",
          content: entry.text.slice(0, 3000),
        }];
      })
    : [];
}

async function openAIReply(message: string, history: ReturnType<typeof getHistory>, env: Env): Promise<string | null> {
  if (!env.OPENAI_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-5.5",
        instructions: SYSTEM_INSTRUCTION,
        input: [...history, { role: "user", content: message }],
        max_output_tokens: 900,
        store: false,
      }),
      signal: controller.signal,
    });
    if (!response.ok) return null;

    const result = await response.json() as {
      output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
    };
    const reply = result.output
      ?.filter((item) => item.type === "message")
      .flatMap((item) => item.content || [])
      .filter((part) => part.type === "output_text")
      .map((part) => part.text || "")
      .join("")
      .trim();
    return reply || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function geminiReply(message: string, history: ReturnType<typeof getHistory>, env: Env): Promise<string | null> {
  if (!env.GEMINI_API_KEY) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  try {
    const model = env.GEMINI_MODEL || "gemini-3.8-flash";
    const contents = [
      ...history.map((entry) => ({
        role: entry.role === "assistant" ? "model" : "user",
        parts: [{ text: entry.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: { maxOutputTokens: 900, temperature: 0.4 },
        }),
        signal: controller.signal,
      },
    );
    if (!response.ok) return null;
    const result = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    return result.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
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

  const history = getHistory(body.history);
  const openAI = await openAIReply(body.message, history, env);
  if (openAI) return json({ reply: openAI, source: env.OPENAI_MODEL || "gpt-5.5" });

  const gemini = await geminiReply(body.message, history, env);
  if (gemini) return json({ reply: gemini, source: env.GEMINI_MODEL || "gemini-3.8-flash" });

  return json({
    reply: localReply(body.message),
    source: "portfolio-fallback",
    degraded: true,
  });
}
