const json = (body: unknown, status = 200): Response => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
export async function onRequest(context: { request: Request }): Promise<Response> {
  if (context.request.method !== "GET") return json({ error: "Method not allowed" }, 405);
  return json({ published: false, message: "Live performance metrics are not published until independently verified." });
}