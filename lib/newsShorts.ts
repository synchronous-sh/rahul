import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NewsStory } from '@/lib/news';

export type NewsShortScene = { title: string; narration: string };
export type NewsShort = NewsStory & {
  shortTitle: string;
  topic: string;
  path: 'ai' | 'business' | 'finance' | 'science' | 'technology' | 'history';
  scenes: NewsShortScene[];
  duration: number;
};

function makeShortTitle(title: string, description: string) {
  const clean = title
    .replace(/\s*[|–—-]\s*(Reuters|AP|BBC|CNN|CNBC|Bloomberg|The Guardian|NPR).*$/i, '')
    .replace(/\baccording to\b.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const goodNews = clean.match(/^Good news for (.+)$/i);
  if (goodNews) {
    const subject = goodNews[1].replace(/\b(popular|much-loved|beloved)\b/gi, '').replace(/\s+/g, ' ').trim();
    return /upgrade/i.test(description) ? `${subject} receives a major upgrade` : `${subject} gets good news`;
  }

  const complete = clean
    .replace(/^(.+?)\s+facing\s+/i, '$1 face ')
    .replace(/^(.+?)\s+seeking\s+/i, '$1 seek ')
    .replace(/^(.+?)\s+planning\s+/i, '$1 plan ')
    .replace(/^(.+?)\s+considering\s+/i, '$1 consider ')
    .replace(/^(.+?)\s+preparing\s+/i, '$1 prepare ')
    .replace(/^(.+?)\s+eyeing\s+/i, '$1 eye ')
    .replace(/^(\d{4}\s+)?(.+? playoff contenders):?$/i, '$2 race takes shape');
  const words = complete.split(' ');
  const selected: string[] = [];
  for (const word of words) {
    if (selected.length >= 8 || (selected.length >= 4 && [...selected, word].join(' ').length > 42)) break;
    selected.push(word);
  }
  if (selected.length < words.length) {
    const clauseBreakers = new Set(['about', 'after', 'amid', 'as', 'because', 'before', 'despite', 'during', 'for', 'from', 'over', 'since', 'through', 'under', 'while', 'with']);
    const lastBreaker = selected.map(word => word.toLowerCase().replace(/[^a-z]/g, '')).findLastIndex(word => clauseBreakers.has(word));
    if (lastBreaker >= 3) selected.splice(lastBreaker);
  }
  const dangling = new Set(['about', 'across', 'after', 'against', 'amid', 'and', 'as', 'at', 'before', 'behind', 'between', 'by', 'for', 'from', 'in', 'into', 'near', 'of', 'on', 'or', 'over', 'the', 'through', 'to', 'under', 'with']);
  while (selected.length > 3 && dangling.has(selected[selected.length - 1].toLowerCase().replace(/[^a-z]/g, ''))) selected.pop();
  const candidate = selected.join(' ').replace(/[:;,.-]+$/, '');
  const hasPredicate = /\b(is|are|was|were|has|have|had|will|would|can|could|may|might|must|should|face|faces|get|gets|receive|receives|seek|seeks|plan|plans|consider|considers|prepare|prepares|eye|eyes|fire|fires|restrict|restricts|rise|rises|fall|falls|win|wins|lose|loses|open|opens|close|closes|launch|launches|announce|announces|approve|approves|reject|rejects|warn|warns|say|says|take|takes|make|makes|move|moves|change|changes|[a-z]+ed)\b/i.test(candidate);
  if (!candidate) return 'Today’s news explained';
  if (hasPredicate) return candidate;
  const descriptionLead = description
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[.!?]/)[0]
    .split(' ')
    .slice(0, 7)
    .join(' ')
    .replace(/[:;,.-]+$/, '');
  const leadHasPredicate = /\b(is|are|was|were|has|have|had|will|can|could|may|faces?|gets?|receives?|seeks?|plans?|moves?|changes?|[a-z]+ed)\b/i.test(descriptionLead);
  return descriptionLead && descriptionLead.length <= 42 && leadHasPredicate ? descriptionLead : `${candidate} explained`;
}

const sentenceParts = (value: string) => value.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).map(item => item.trim()).filter(item => item.length > 24);

function classify(story: NewsStory) {
  const words = `${story.title} ${story.dek}`.toLowerCase();
  if (story.category === 'U.S.') return { topic: 'U.S.', path: 'history' as const };
  if (story.category === 'History') return { topic: 'History', path: 'history' as const };
  if (story.category === 'Health') return { topic: 'Health', path: 'science' as const };
  if (story.category === 'Politics') return { topic: 'Politics', path: 'history' as const };
  if (story.category === 'Culture') return { topic: 'Culture', path: 'history' as const };
  if (story.category === 'Music') return { topic: 'Music', path: 'history' as const };
  if (story.category === 'Lifestyle') return { topic: 'Lifestyle', path: 'science' as const };
  if (story.category === 'Entertainment') return { topic: 'Entertainment', path: 'history' as const };
  if (story.category === 'Food') return { topic: 'Food', path: 'science' as const };
  if (story.category === 'Sports') return { topic: 'Sports', path: 'science' as const };
  if (/\b(ai|artificial intelligence|machine learning|model|chip|semiconductor)\b/.test(words)) return { topic: 'AI', path: 'ai' as const };
  if (story.category === 'Markets') return { topic: 'Markets', path: 'finance' as const };
  if (story.category === 'Business') return { topic: 'Business', path: 'business' as const };
  if (story.category === 'Science') return { topic: 'Science', path: 'science' as const };
  if (story.category === 'Technology') return { topic: 'Technology', path: 'technology' as const };
  return { topic: 'World', path: 'history' as const };
}

function localScenes(story: NewsStory): NewsShortScene[] {
  const sentences = sentenceParts(`${story.dek}. ${story.content ?? ''}`);
  const facts = [...new Set(sentences)].slice(0, 5);
  return [
    { title: story.title, narration: story.dek },
    ...facts.filter(item => item !== story.dek).map((narration, index) => ({ title: index === 0 ? 'What happened' : index === 1 ? 'Why it matters' : 'The context', narration })),
    { title: `Reporting from ${story.source}`, narration: 'Open the source card for the full news summary and original reporting.' },
  ].slice(0, 6);
}

export async function buildNewsShort(story: NewsStory): Promise<NewsShort> {
  const cacheKey = `synchronous-news-short:${story.id}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  let scenes: NewsShortScene[] | undefined = cached ? JSON.parse(cached) : undefined;
  if (!scenes) { scenes = localScenes(story); await AsyncStorage.setItem(cacheKey, JSON.stringify(scenes)); }
  const classification = classify(story);
  return { ...story, shortTitle: makeShortTitle(story.title, story.dek), ...classification, scenes, duration: Math.max(24, scenes.length * 7) };
}
