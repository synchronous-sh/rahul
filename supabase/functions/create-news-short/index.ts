import { checkRateLimit, requireUser } from '../_shared/auth.ts';
import { openAIJson } from '../_shared/openai.ts';
import { errorMessage, handleOptions, json } from '../_shared/http.ts';

Deno.serve(async (req) => {
  const options = handleOptions(req); if (options) return options;
  try {
    const { user, authorization } = await requireUser(req);
    const body = await req.json();
    const title = String(body.title ?? '').trim().slice(0, 300);
    const description = String(body.description ?? '').trim().slice(0, 1500);
    const content = String(body.content ?? '').trim().slice(0, 7000);
    const source = String(body.source ?? '').trim().slice(0, 180);
    const link = String(body.link ?? '').trim().slice(0, 2000);
    if (!title || !description || !/^https?:\/\//.test(link)) return json({ error: 'A verified source article is required.' }, 400);
    await checkRateLimit(user.id, authorization, 'news-short', title.length + description.length + content.length);
    const result = await openAIJson(
      'Turn verified source material into a factual 30–45 second mobile news video script. Use only facts explicitly present in the supplied title, description, and content. Do not invent details, quotes, numbers, or causal claims. Use plain language. Return 4–6 sequential scenes.',
      `Publisher: ${source}\nURL: ${link}\nTitle: ${title}\nDescription: ${description}\nArticle text: ${content || 'No additional text supplied.'}`,
      'news_short',
      { type: 'object', additionalProperties: false, required: ['scenes'], properties: { scenes: { type: 'array', minItems: 4, maxItems: 6, items: { type: 'object', additionalProperties: false, required: ['title', 'narration'], properties: { title: { type: 'string' }, narration: { type: 'string' } } } } } },
    );
    return json(result);
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: errorMessage(error) }, 500);
  }
});

