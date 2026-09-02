import { checkRateLimit, requireUser } from "../_shared/auth.ts";
import { openAIJson } from "../_shared/openai.ts";
import { errorMessage, handleOptions, json } from "../_shared/http.ts";

Deno.serve(async (req) => {
  const options = handleOptions(req); if (options) return options;
  try {
    const { user, authorization } = await requireUser(req);
    const body = await req.json();
    const question = String(body.question ?? "").trim().slice(0, 1000);
    const context = String(body.context ?? "").trim().slice(0, 8000);
    if (question.length < 2) return json({ error: "Enter a question." }, 400);
    await checkRateLimit(user.id, authorization, "ask", question.length + context.length);
    const answer = await openAIJson(
      "Answer as a careful learning tutor. Use the supplied context when available, clearly distinguish facts from inference, explain unfamiliar terms, and never invent a source. Keep the answer concise but useful.",
      `Context:\n${context || "No specific content was supplied."}\n\nQuestion:\n${question}`,
      "tutor_answer",
      { type: "object", additionalProperties: false, required: ["answer", "followUps"], properties: { answer: { type: "string" }, followUps: { type: "array", maxItems: 3, items: { type: "string" } } } },
    );
    return json(answer);
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: errorMessage(error) }, 500);
  }
});
