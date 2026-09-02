const apiKey = Deno.env.get("OPENAI_API_KEY") ?? Deno.env.get("OpenAI_KEY");
export const textModel = Deno.env.get("OPENAI_TEXT_MODEL") ?? "gpt-5.6-sol";

function key() {
  const normalized = apiKey?.trim();
  if (!normalized) throw new Error("OpenAI API key is not configured");
  if (!normalized.startsWith("sk-")) throw new Error("OpenAI API key is malformed. Replace the Supabase function secret.");
  return normalized;
}

export async function openAIJson(instructions: string, input: string, name: string, schema: Record<string, unknown>) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: textModel,
      instructions,
      input,
      text: { format: { type: "json_schema", name, strict: true, schema } },
    }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message ?? "OpenAI request failed");
  const text = payload.output_text ?? payload.output?.flatMap((item: any) => item.content ?? []).find((item: any) => item.type === "output_text")?.text;
  if (!text) throw new Error("OpenAI returned no structured output");
  return JSON.parse(text);
}

export async function embedding(input: string | string[]) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${key()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "text-embedding-3-small", input, encoding_format: "float" }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message ?? "Embedding request failed");
  return payload.data.map((item: any) => item.embedding as number[]);
}

export function openAIKey() { return key(); }
