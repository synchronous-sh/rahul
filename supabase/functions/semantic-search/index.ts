import { checkRateLimit, requireUser } from "../_shared/auth.ts";
import { embedding } from "../_shared/openai.ts";
import { errorMessage, handleOptions, json } from "../_shared/http.ts";

function cosine(a: number[], b: number[]) {
  let dot = 0, aa = 0, bb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; aa += a[i] ** 2; bb += b[i] ** 2; }
  return dot / (Math.sqrt(aa) * Math.sqrt(bb) || 1);
}

Deno.serve(async (req) => {
  const options = handleOptions(req); if (options) return options;
  try {
    const { user, authorization } = await requireUser(req);
    const body = await req.json();
    const query = String(body.query ?? "").trim().slice(0, 300);
    const candidates = Array.isArray(body.candidates) ? body.candidates.slice(0, 60).map((item: any) => ({ id: String(item.id).slice(0, 100), text: String(item.text).slice(0, 600) })) : [];
    if (query.length < 2 || !candidates.length) return json({ error: "A query and search candidates are required." }, 400);
    await checkRateLimit(user.id, authorization, "semantic_search", query.length);
    const vectors = await embedding([query, ...candidates.map((item) => item.text)]);
    const results = candidates.map((item, index) => ({ id: item.id, score: cosine(vectors[0], vectors[index + 1]) })).sort((a, b) => b.score - a.score).slice(0, 20);
    return json({ results });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: errorMessage(error) }, 500);
  }
});
