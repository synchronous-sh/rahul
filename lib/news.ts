import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import type { Story } from '@/data/content';

export type NewsStory = Story & { link?: string; content?: string; publishedAt?: string };
type NewsResponse = { articles: Array<{ id: string; title: string; description: string; content: string; link: string; imageUrl: string; sourceName: string; publishedAt: string; categories: string[] }>; nextPage?: string | null };

const CACHE_PREFIX = 'synchronous-news-v6:';
const DETAIL_PREFIX = 'synchronous-news-story:';
const LIVE_INDEX_KEY = 'synchronous-news-live-index-v1';
const CACHE_MS = 10 * 60 * 1000;

const categoryLabel = (values: string[], requested?: string): Story['category'] => {
  const supported: Story['category'][] = ['For You', 'U.S.', 'World', 'History', 'Business', 'Markets', 'Technology', 'Science', 'Health', 'Politics', 'Culture', 'Music', 'Lifestyle', 'Entertainment', 'Food', 'Sports'];
  if (requested && supported.includes(requested as Story['category'])) return requested as Story['category'];
  const value = values[0]?.toLowerCase();
  if (value === 'business' || value === 'economy_business_finance') return 'Business';
  if (value === 'technology' || value === 'science_technology') return 'Technology';
  if (value === 'science' || value === 'health' || value === 'environment') return 'Science';
  if (value === 'world' || value === 'politics' || value === 'politics_government' || value === 'society') return 'World';
  return 'World';
};

const relativeTime = (value: string) => {
  const timestamp = new Date(value.replace(' ', 'T') + (value.includes('Z') ? '' : 'Z')).getTime();
  if (!Number.isFinite(timestamp)) return 'Recently';
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} hr ago` : `${Math.floor(hours / 24)} d ago`;
};

async function ensureSession() {
  const current = await supabase.auth.getSession();
  if (current.data.session) return;
  const guest = await supabase.auth.signInAnonymously({ options: { data: { is_guest: true } } });
  if (guest.error) throw guest.error;
}

export async function fetchNews(category = 'For You', force = false): Promise<NewsStory[]> {
  const cacheKey = `${CACHE_PREFIX}${category}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached && !force) {
    const parsed = JSON.parse(cached) as { savedAt: number; stories: NewsStory[] };
    if (Date.now() - parsed.savedAt < CACHE_MS) return parsed.stories;
  }

  await ensureSession();
  const request = category === 'U.S.'
    ? { category: 'top', country: 'us' }
    : category === 'Markets'
      ? { category: 'business', query: 'markets OR stocks OR economy', topic: 'markets' }
      : category === 'History'
        ? { query: 'history OR archaeology OR historical', topic: 'history' }
        : category === 'Culture'
          ? { category: 'entertainment', query: 'culture OR arts', topic: 'culture' }
          : category === 'Music'
            ? { category: 'entertainment', query: 'music', topic: 'music' }
            : category === 'For You'
              ? { category: 'top' }
              : { category: category.toLowerCase(), topic: category.toLowerCase() };
  const { data, error } = await supabase.functions.invoke<NewsResponse>('news-feed', { body: request });
  if (error) {
    if (cached) return (JSON.parse(cached) as { stories: NewsStory[] }).stories;
    throw error;
  }
  const stories: NewsStory[] = (data?.articles ?? []).filter((article) => {
    try {
      const url = new URL(article.link);
      return (url.protocol === 'https:' || url.protocol === 'http:') && Boolean(url.hostname);
    } catch { return false; }
  }).filter((article) => {
    try { return Boolean(article.imageUrl && new URL(article.imageUrl).hostname); }
    catch { return false; }
  }).map((article) => ({
    id: `live-${article.id}`,
    category: categoryLabel(article.categories, category),
    title: article.title,
    dek: article.description || article.content || 'Open the original report for the complete story.',
    source: article.sourceName || 'NewsData.io',
    time: relativeTime(article.publishedAt),
    image: article.imageUrl,
    link: article.link,
    content: article.content,
    publishedAt: article.publishedAt,
  }));
  await AsyncStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), stories }));
  await Promise.all(stories.map((story) => AsyncStorage.setItem(`${DETAIL_PREFIX}${story.id}`, JSON.stringify(story))));
  const previous = await getCachedNewsStories();
  const merged = [...stories, ...previous].filter((story, index, all) => all.findIndex((item) => item.id === story.id) === index).slice(0, 100);
  await AsyncStorage.setItem(LIVE_INDEX_KEY, JSON.stringify(merged));
  return stories;
}

export async function getCachedNewsStory(id: string): Promise<NewsStory | null> {
  const raw = await AsyncStorage.getItem(`${DETAIL_PREFIX}${id}`);
  return raw ? JSON.parse(raw) : null;
}

export async function getCachedNewsStories(): Promise<NewsStory[]> {
  const raw = await AsyncStorage.getItem(LIVE_INDEX_KEY);
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as NewsStory[]).filter((story) => Boolean(story.link));
  } catch { return []; }
}
