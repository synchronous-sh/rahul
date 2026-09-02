import { checkRateLimit, requireUser } from "../_shared/auth.ts";
import { openAIKey } from "../_shared/openai.ts";
import { errorMessage, handleOptions, json } from "../_shared/http.ts";

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

Deno.serve(async (req) => {
  const options = handleOptions(req); if (options) return options;
  try {
    const { user, authorization } = await requireUser(req);
    const body = await req.json();
    const text = String(body.text ?? "").trim().slice(0, 6000);
    const voice = ["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer", "verse", "marin", "cedar"].includes(body.voice) ? body.voice : "marin";
    const requestedSpeed = Number(body.speed);
    const speed = [0.75, 1, 1.25, 1.5].includes(requestedSpeed) ? requestedSpeed : 1;
    if (!text) return json({ error: "Text is required." }, 400);
    await checkRateLimit(user.id, authorization, "speech", text.length);
    const pace = speed === 0.75 ? "slowly at about three quarters of normal conversational speed" : speed === 1.25 ? "briskly at about one and a quarter times normal conversational speed" : speed === 1.5 ? "quickly at about one and a half times normal conversational speed" : "at a natural conversational speed";
    const response = await fetch("https://api.openai.com/v1/audio/speech", { method: "POST", headers: { Authorization: `Bearer ${openAIKey()}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-4o-mini-tts", voice, input: text, response_format: "mp3", instructions: `Speak clearly, calmly, and naturally like an excellent teacher, ${pace}.` }) });
    if (!response.ok) { const payload = await response.json(); throw new Error(payload?.error?.message ?? "Speech generation failed"); }
    return json({ audioBase64: toBase64(new Uint8Array(await response.arrayBuffer())), mimeType: "audio/mpeg" });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: errorMessage(error) }, 500);
  }
});
