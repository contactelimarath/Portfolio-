interface Env { OPENAI_API_KEY?: string; GEMINI_API_KEY?: string; }
const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  if (context.request.method !== "GET") return json({ error: "Method not allowed" }, 405);
  const openAIConfigured = Boolean(context.env.OPENAI_API_KEY);
  const geminiConfigured = Boolean(context.env.GEMINI_API_KEY);
  return json({
    ok: true,
    service: "portfolio-api",
    aiConfigured: openAIConfigured || geminiConfigured,
    provider: openAIConfigured ? "openai" : geminiConfigured ? "gemini" : "local-fallback",
    openAIConfigured,
    geminiConfigured,
  });
}
