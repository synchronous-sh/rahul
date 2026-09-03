import { checkRateLimit, requireUser } from "../_shared/auth.ts";
import { openAIJson } from "../_shared/openai.ts";
import { errorMessage, handleOptions, json } from "../_shared/http.ts";

function isSafeArticleUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return ["http:", "https:"].includes(url.protocol)
      && host !== "localhost"
      && host !== "::1"
      && !host.endsWith(".local")
      && !/^(127|10|0)\./.test(host)
      && !/^192\.168\./.test(host)
      && !/^169\.254\./.test(host)
      && !/^172\.(1[6-9]|2\d|3[01])\./.test(host);
  } catch {
    return false;
  }
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function readableText(html: string) {
  return html
    .replace(/<(script|style|noscript|svg|nav|footer|header|form)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLdArticleBody(value: unknown): string {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = jsonLdArticleBody(item);
      if (found) return found;
    }
  } else if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.articleBody === "string") return readableText(record.articleBody);
    for (const child of Object.values(record)) {
      const found = jsonLdArticleBody(child);
      if (found) return found;
    }
  }
  return "";
}

function extractPublisherBody(html: string) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of scripts) {
    try {
      const body = jsonLdArticleBody(JSON.parse(match[1]));
      if (body.split(/\s+/).length >= 80) return body;
    } catch { /* Publishers occasionally emit malformed JSON-LD. */ }
  }

  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => readableText(decodeEntities(match[1])))
    .filter((text) => text.length >= 60 && !/cookie|subscribe|newsletter|sign up|advertisement/i.test(text));
  return [...new Set(paragraphs)].join(" ");
}

function sourceBackedBrief(sourceMaterial: string, description: string) {
  const headings = ["Summary", "Insights", "Background", "Impact", "Outlook"];
  const normalizedDescription = readableText(description).toLowerCase();
  const sentences = readableText(sourceMaterial)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence, index, all) => sentence.length >= 35
      && !normalizedDescription.includes(sentence.toLowerCase())
      && all.indexOf(sentence) === index);
  const selected: string[] = [];
  let words = 0;
  for (const sentence of sentences) {
    const count = sentence.split(/\s+/).length;
    if (words >= 400 && words + count > 480) break;
    if (words + count <= 500) {
      selected.push(sentence);
      words += count;
    }
  }
  const groups = headings.map(() => [] as string[]);
  let groupIndex = 0;
  let groupWords = 0;
  const targetWords = Math.max(1, Math.ceil(words / headings.length));
  for (const sentence of selected) {
    if (groupIndex < headings.length - 1 && groupWords >= targetWords) {
      groupIndex += 1;
      groupWords = 0;
    }
    groups[groupIndex].push(sentence);
    groupWords += sentence.split(/\s+/).length;
  }
  return {
    sections: headings.map((heading, index) => ({ heading, paragraphs: [groups[index].join(" ")] })),
  };
}

function briefWordCount(result: { sections?: Array<{ paragraphs?: string[] }> }) {
  return (result.sections ?? [])
    .flatMap((section) => section.paragraphs ?? [])
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

async function fetchPublisherText(link: string) {
  if (!isSafeArticleUrl(link)) return "";
  try {
    const response = await fetch(link, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 (compatible; SynchronousNews/1.0)",
      },
    });
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) return "";
    const html = (await response.text()).slice(0, 500_000);
    const text = extractPublisherBody(html);
    return text.length >= 400 ? text.slice(0, 24_000) : "";
  } catch {
    return "";
  }
}

Deno.serve(async (req) => {
  const options = handleOptions(req); if (options) return options;
  try {
    const { user, authorization } = await requireUser(req);
    const body = await req.json();
    const title = String(body.title ?? "").trim().slice(0, 400);
    const description = String(body.description ?? "").trim().slice(0, 2500);
    const content = String(body.content ?? "").trim().slice(0, 12000);
    const source = String(body.source ?? "the publisher").trim().slice(0, 200);
    const link = String(body.link ?? "").trim().slice(0, 2000);
    if (!title || !description || !isSafeArticleUrl(link)) return json({ error: "A verified source article is required." }, 400);
    const publisherText = await fetchPublisherText(link);
    const sourceMaterial = [description, content, publisherText].filter(Boolean).join("\n\n");
    await checkRateLimit(user.id, authorization, "news_brief", title.length + sourceMaterial.length);
    let result;
    try {
      result = await openAIJson(
        "Write a polished, neutral mobile news brief using only facts contained in the supplied source material. Never add unsupported names, figures, quotations, causes, chronology, or conclusions. Preserve uncertainty and attribution. The complete body must be 400 to 500 words. Produce exactly five sections, in this exact order and with these exact headings: Summary, Insights, Background, Impact, Outlook. Give each section one or two coherent paragraphs. Summary should state the essential development; Insights should synthesize only implications directly supported by the reporting; Background should explain verified context; Impact should describe confirmed or clearly attributed effects without speculation; Outlook should identify what the reporting says comes next and preserve uncertainty. Use a professional newsroom style and avoid repetition, filler, editorializing, or repeating the supplied standfirst verbatim.",
        `Publisher: ${source}\nOriginal URL: ${link}\nHeadline: ${title}\nVerified source material:\n${sourceMaterial}`,
        "grounded_news_brief",
        { type: "object", additionalProperties: false, required: ["sections"], properties: { sections: { type: "array", minItems: 5, maxItems: 5, items: { type: "object", additionalProperties: false, required: ["heading", "paragraphs"], properties: { heading: { type: "string", enum: ["Summary", "Insights", "Background", "Impact", "Outlook"] }, paragraphs: { type: "array", minItems: 1, maxItems: 2, items: { type: "string" } } } } } } },
      );
    } catch {
      result = sourceBackedBrief([publisherText, content].filter(Boolean).join(" "), description);
    }
    const wordCount = briefWordCount(result);
    const expectedHeadings = ["Summary", "Insights", "Background", "Impact", "Outlook"];
    const hasRequiredStructure = result.sections?.length === expectedHeadings.length
      && result.sections.every((section: { heading?: string; paragraphs?: string[] }, index: number) =>
        section.heading === expectedHeadings[index] && section.paragraphs?.some((paragraph) => paragraph.trim()));
    if (!hasRequiredStructure || wordCount < 400 || wordCount > 500) {
      return json({ error: "The publisher did not provide enough verified article text for a complete 400–500-word brief." }, 422);
    }
    return json(result);
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: errorMessage(error) }, 500);
  }
});
