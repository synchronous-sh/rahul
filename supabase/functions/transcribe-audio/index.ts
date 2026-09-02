import { checkRateLimit, requireUser } from "../_shared/auth.ts";
import { openAIKey } from "../_shared/openai.ts";
import { errorMessage, handleOptions, json } from "../_shared/http.ts";

function fromBase64(value: string) {
  const binary = atob(value); const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

Deno.serve(async (req) => {
  const options = handleOptions(req); if (options) return options;
  try {
    const { user, authorization } = await requireUser(req);
    const body = await req.json();
    const audioBase64 = String(body.audioBase64 ?? "");
    const mimeType = String(body.mimeType ?? "audio/m4a").slice(0, 80);
    if (!audioBase64 || audioBase64.length > 12_000_000) return json({ error: "Record an audio clip shorter than one minute." }, 400);
    await checkRateLimit(user.id, authorization, "transcription", Math.ceil(audioBase64.length * 0.75));
    const form = new FormData();
    form.append("model", "gpt-4o-mini-transcribe");
    form.append("file", new Blob([fromBase64(audioBase64)], { type: mimeType }), "recording.m4a");
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${openAIKey()}` }, body: form });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message ?? "Transcription failed");
    return json({ text: payload.text ?? "" });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: errorMessage(error) }, 500);
  }
});
