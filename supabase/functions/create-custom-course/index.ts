import { requireUser, checkRateLimit, insertCustomCourse } from "../_shared/auth.ts";
import { openAIJson } from "../_shared/openai.ts";
import { errorMessage, handleOptions, json } from "../_shared/http.ts";

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "description", "units"],
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    units: { type: "array", minItems: 3, maxItems: 6, items: {
      type: "object", additionalProperties: false, required: ["title", "description", "lessons"], properties: {
        title: { type: "string" }, description: { type: "string" },
        lessons: { type: "array", minItems: 3, maxItems: 6, items: {
          type: "object", additionalProperties: false, required: ["title", "objective", "estimatedMinutes", "slides", "quiz"], properties: {
            title: { type: "string" }, objective: { type: "string" }, estimatedMinutes: { type: "integer", minimum: 10, maximum: 30 },
            slides: { type: "array", minItems: 8, maxItems: 14, items: { type: "object", additionalProperties: false, required: ["title", "body", "visualPrompt", "keyPoint"], properties: { title: { type: "string" }, body: { type: "string" }, visualPrompt: { type: "string" }, keyPoint: { type: "string" } } } },
            quiz: { type: "array", minItems: 3, maxItems: 3, items: { type: "object", additionalProperties: false, required: ["question", "options", "correctIndex", "explanation"], properties: { question: { type: "string" }, options: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } }, correctIndex: { type: "integer", minimum: 0, maximum: 3 }, explanation: { type: "string" } } } },
          },
        } },
      },
    } },
  },
};

Deno.serve(async (req) => {
  const options = handleOptions(req); if (options) return options;
  try {
    const { user, authorization } = await requireUser(req);
    const body = await req.json();
    const title = String(body.title ?? "").trim().slice(0, 120);
    const description = String(body.description ?? "").trim().slice(0, 1000);
    const category = String(body.category ?? "Other").trim().slice(0, 80);
    const difficulty = ["Beginner", "Intermediate", "Advanced"].includes(body.difficulty) ? body.difficulty : "Beginner";
    const learningStyle = String(body.learningStyle ?? "Mixed").slice(0, 80);
    const lessonLength = String(body.lessonLength ?? "15–20 minutes").slice(0, 40);
    const goal = String(body.goal ?? "Understand the fundamentals").slice(0, 120);
    if (title.length < 3) return json({ error: "Course title must contain at least 3 characters." }, 400);
    await checkRateLimit(user.id, authorization, "course", title.length + description.length);
    const outline = await openAIJson(
      "You are an expert curriculum designer. Build a cumulative, accurate course where each lesson depends on earlier concepts. Slides must genuinely teach with concrete examples, not repeat the title. Every lesson ends with exactly three unambiguous mastery questions. Do not claim citations or invent sources.",
      JSON.stringify({ title, description, category, difficulty, learningStyle, lessonLength, goal }),
      "custom_course",
      schema,
    );
    const course = await insertCustomCourse(authorization, { user_id: user.id, title: outline.title, description: outline.description, category, difficulty, learning_style: learningStyle, lesson_length: lessonLength, goal, status: "ready", outline });
    return json({ course: { ...course, ...outline, learningStyle } });
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: errorMessage(error) }, 500);
  }
});
