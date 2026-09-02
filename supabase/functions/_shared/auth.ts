type User = { id: string; email?: string; phone?: string; is_anonymous?: boolean };

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

export async function requireUser(req: Request): Promise<{ user: User; authorization: string }> {
  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) throw new Response("Unauthorized", { status: 401 });
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: authorization, apikey: anonKey },
  });
  if (!response.ok) throw new Response("Unauthorized", { status: 401 });
  return { user: await response.json(), authorization };
}

export async function checkRateLimit(userId: string, authorization: string, kind: string, units = 0) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const countResponse = await fetch(
    `${supabaseUrl}/rest/v1/ai_requests?select=id&user_id=eq.${encodeURIComponent(userId)}&created_at=gte.${encodeURIComponent(since)}`,
    { headers: { Authorization: authorization, apikey: anonKey, Prefer: "count=exact", Range: "0-0" } },
  );
  const range = countResponse.headers.get("content-range") ?? "0/0";
  const count = Number(range.split("/")[1] ?? 0);
  if (!countResponse.ok || count >= 30) throw new Response("Hourly AI limit reached. Please try again later.", { status: 429 });
  const logResponse = await fetch(`${supabaseUrl}/rest/v1/ai_requests`, {
    method: "POST",
    headers: { Authorization: authorization, apikey: anonKey, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ user_id: userId, kind, input_units: Math.max(0, Math.round(units)) }),
  });
  if (!logResponse.ok) throw new Error("Could not record AI request");
}

export async function insertCustomCourse(authorization: string, course: Record<string, unknown>) {
  const response = await fetch(`${supabaseUrl}/rest/v1/custom_courses`, {
    method: "POST",
    headers: { Authorization: authorization, apikey: anonKey, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(course),
  });
  if (!response.ok) throw new Error("Could not save generated course");
  return (await response.json())[0];
}
