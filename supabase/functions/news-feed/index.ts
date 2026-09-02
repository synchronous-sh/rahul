import { handleOptions, json } from "../_shared/http.ts";

const allowedCategories = new Set([
  "top", "business", "crime", "domestic", "education", "entertainment",
  "environment", "food", "health", "lifestyle", "politics", "science",
  "sports", "technology", "tourism", "world",
]);

const clean = (value: unknown, limit: number) => String(value ?? "").trim().slice(0, limit);

const isPublisherUrl = (value: unknown) => {
  try {
    const url = new URL(clean(value, 2000));
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname) && !url.hostname.includes("example.com");
  } catch { return false; }
};

const isImageUrl = (value: unknown) => {
  try {
    const url = new URL(clean(value, 2000));
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch { return false; }
};

const currentsCategory: Record<string, string> = {
  top: "general",
  business: "economy_business_finance",
  technology: "science_technology",
  science: "science_technology",
  politics: "politics_government",
  sports: "sport",
  entertainment: "arts_culture_entertainment",
  lifestyle: "lifestyle_leisure",
  crime: "crime_law_justice",
  environment: "environment",
  education: "education",
  health: "health",
  world: "society",
};

const providerCategoryAliases: Record<string, Set<string>> = {
  domestic: new Set(["domestic"]),
  business: new Set(["business", "economy_business_finance"]),
  entertainment: new Set(["entertainment", "arts_culture_entertainment"]),
  food: new Set(["food"]),
  health: new Set(["health"]),
  lifestyle: new Set(["lifestyle", "lifestyle_leisure"]),
  politics: new Set(["politics", "politics_government"]),
  science: new Set(["science", "science_technology"]),
  sports: new Set(["sports", "sport"]),
  technology: new Set(["technology", "science_technology"]),
  world: new Set(["world", "society"]),
};

const topicKeywords: Record<string, string[]> = {
  us: ["u.s.", "united states", "american", "america", "white house", "congress", "senate"],
  business: ["business", "company", "companies", "corporate", "industry", "executive", "ceo", "revenue", "profit", "earnings", "acquisition"],
  markets: ["market", "stock", "bond", "investor", "trading", "economy", "economic", "inflation", "federal reserve", "interest rate"],
  history: ["history", "historical", "archaeology", "ancient", "century", "empire", "war", "archive", "heritage"],
  technology: ["technology", "tech", "software", "computer", "digital", "internet", "cyber", "chip", "semiconductor", "robot", "artificial intelligence", "ai"],
  science: ["science", "scientist", "research", "study", "fossil", "space", "climate", "physics", "biology", "chemistry", "astronomy"],
  health: ["health", "medical", "medicine", "doctor", "patient", "disease", "hospital", "wellness", "nutrition", "mental health"],
  politics: ["politics", "political", "government", "president", "minister", "congress", "senate", "election", "policy", "lawmakers"],
  culture: ["culture", "cultural", "art", "museum", "literature", "book", "film", "theater", "theatre"],
  music: ["music", "singer", "song", "album", "concert", "musician", "band", "recording"],
  lifestyle: ["lifestyle", "fashion", "travel", "parenting", "relationship", "beauty", "wellness", "hobby"],
  entertainment: ["entertainment", "film", "movie", "television", "tv", "actor", "actress", "celebrity", "streaming", "show"],
  food: ["food", "restaurant", "recipe", "chef", "cooking", "cuisine", "meal", "dish", "breakfast", "lunch", "dinner", "burger", "donut"],
  sports: ["sport", "sports", "football", "soccer", "baseball", "basketball", "hockey", "tennis", "golf", "nfl", "nba", "mlb", "nhl", "team", "match", "playoff"],
};

const topicSearchQueries: Record<string, string> = {
  business: "business OR company OR earnings",
  technology: "technology OR software OR cybersecurity OR semiconductor OR AI",
  science: "science OR research OR space OR climate",
  entertainment: "film OR television OR music OR culture",
  lifestyle: "lifestyle OR fashion OR travel OR wellness",
  food: "food OR restaurant OR recipe OR cooking",
  sports: "sports OR football OR soccer OR baseball OR basketball",
};

const containsKeyword = (text: string, keyword: string) => {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(text);
};

const sourceFromUrl = (value: unknown) => {
  try { return new URL(clean(value, 2000)).hostname.replace(/^www\./, ""); }
  catch { return "Currents"; }
};

Deno.serve(async (req) => {
  const options = handleOptions(req);
  if (options) return options;
  try {
    const newsDataKey = Deno.env.get("NEWSDATAIO_KEY")?.trim();
    const currentsKey = Deno.env.get("CURRENTSNEWSAPI_KEY")?.trim();
    if (!newsDataKey && !currentsKey) return json({ error: "No news provider is configured." }, 503);

    const body = await req.json().catch(() => ({}));
    const category = clean(body.category, 30).toLowerCase();
    const query = clean(body.query, 120);
    const page = clean(body.page, 200);
    const country = clean(body.country, 8).toLowerCase();
    const topic = clean(body.topic, 30).toLowerCase();
    const effectiveQuery = query || topicSearchQueries[topic] || "";

    const requests: Promise<{ provider: string; articles: Record<string, unknown>[]; nextPage?: string | null }>[] = [];
    if (newsDataKey) requests.push((async () => {
      const params = new URLSearchParams({ apikey: newsDataKey, language: "en", removeduplicate: "1" });
      if (category && allowedCategories.has(category)) params.set("category", category);
      if (effectiveQuery) params.set("q", effectiveQuery);
      if (page) params.set("page", page);
      if (country === "us") params.set("country", "us");
      const response = await fetch(`https://newsdata.io/api/1/latest?${params.toString()}`);
      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.status !== "success") throw new Error(payload?.results?.message ?? payload?.message ?? "NewsData.io request failed.");
      return { provider: "newsdata", nextPage: payload.nextPage ?? null, articles: (Array.isArray(payload.results) ? payload.results : []).map((article: Record<string, unknown>) => ({
        id: `nd-${clean(article.article_id, 160)}`,
        title: clean(article.title, 300), description: clean(article.description, 1200), content: clean(article.content, 8000),
        link: clean(article.link, 2000), imageUrl: clean(article.image_url, 2000),
        sourceName: clean(article.source_name || article.source_id, 160), sourceIcon: clean(article.source_icon, 2000),
        publishedAt: clean(article.pubDate, 80), categories: Array.isArray(article.category) ? article.category.map((item) => clean(item, 40)) : [],
        countries: Array.isArray(article.country) ? article.country.map((item) => clean(item, 40)) : [], provider: "NewsData.io",
      })) };
    })());

    if (currentsKey && (!category || Boolean(currentsCategory[category]) || Boolean(effectiveQuery))) requests.push((async () => {
      const params = new URLSearchParams({ language: "en", page_size: "50" });
      if (category && currentsCategory[category]) params.set("category", currentsCategory[category]);
      if (country === "us") params.set("country", "US");
      if (effectiveQuery) params.set("query", effectiveQuery);
      const endpoint = effectiveQuery ? "search" : "latest-news";
      const response = await fetch(`https://api.currentsapi.services/v2/${endpoint}?${params.toString()}`, { headers: { Authorization: `Bearer ${currentsKey}` } });
      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.status !== "ok") throw new Error(payload?.message ?? "Currents request failed.");
      return { provider: "currents", nextPage: payload.next_cursor ?? null, articles: (Array.isArray(payload.news) ? payload.news : []).map((article: Record<string, unknown>) => ({
        id: `cu-${clean(article.id, 160)}`,
        title: clean(article.title, 300), description: clean(article.description, 1200), content: "",
        link: clean(article.url, 2000), imageUrl: clean(article.image, 2000),
        sourceName: clean(article.author, 160) || sourceFromUrl(article.url), sourceIcon: "",
        publishedAt: clean(article.published, 80), categories: Array.isArray(article.category) ? article.category.map((item) => clean(item, 40)) : [],
        countries: [], provider: "Currents",
      })) };
    })());

    const settled = await Promise.allSettled(requests);
    const successful = settled.filter((result): result is PromiseFulfilledResult<{ provider: string; articles: Record<string, unknown>[]; nextPage?: string | null }> => result.status === "fulfilled").map(result => result.value);
    if (!successful.length) return json({ error: "All configured news providers are temporarily unavailable." }, 502);
    const resultSets = successful;
    const expectedCategories = providerCategoryAliases[category];
    const seen = new Set<string>();
    const seenTitles = new Set<string>();
    const articles = resultSets.flatMap(result => result.articles).filter((article) => {
      if (expectedCategories) {
        const tags = Array.isArray(article.categories) ? article.categories.map(item => clean(item, 40).toLowerCase()) : [];
        if (!tags.some(tag => expectedCategories.has(tag))) return false;
      }
      if (category === "world") {
        const countries = Array.isArray(article.countries) ? article.countries.map(item => clean(item, 40).toLowerCase()) : [];
        if (countries.some(countryName => ["united states", "united states of america", "us", "usa"].includes(countryName))) return false;
      }
      if (topic && topicKeywords[topic]) {
        const searchable = `${clean(article.title, 300)} ${clean(article.description, 1200)}`;
        if (!topicKeywords[topic].some(keyword => containsKeyword(searchable, keyword))) return false;
        if (topic === "history") {
          const headline = clean(article.title, 300);
          if (/\b(what history says|stock|stocks|etf|market|invest|wrestling|wwe|aew|playoff|football|soccer|baseball|basketball)\b/i.test(headline)) return false;
        }
        if (topic === "food" && /\b(job|jobs|hiring|career|careers|vacancy|vacancies|role|roles)\b/i.test(searchable)) return false;
      }
      const title = clean(article.title, 300);
      if (!isPublisherUrl(article.link) || !isImageUrl(article.imageUrl)) return false;
      const key = clean(article.link, 2000).toLowerCase() || title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      const titleKey = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      if (!title || !key || !titleKey || seen.has(key) || seenTitles.has(titleKey)) return false;
      seen.add(key); seenTitles.add(titleKey); return true;
    }).sort((a, b) => Date.parse(clean(b.publishedAt, 80)) - Date.parse(clean(a.publishedAt, 80)));

    return new Response(JSON.stringify({ articles, nextPage: successful.find(item => item.nextPage)?.nextPage ?? null, providers: successful.map(item => item.provider) }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not load news." }, 500);
  }
});
