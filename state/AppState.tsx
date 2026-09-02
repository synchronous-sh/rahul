import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { feed } from '@/data/content';
import { recommendationScore } from '@/lib/recommendation';

export type OnboardingProfile = { interests: string[]; subtopics: Record<string, string[]>; level: 'Beginner' | 'Intermediate' | 'Advanced'; goals: string[]; learningStyles: string[] };
type State = {
  onboarded: boolean | null; interests: string[]; saved: string[]; liked: string[]; xp: number; streak: number; completedLessons: number; completedLessonIds: string[];
  finishOnboarding: (profile: OnboardingProfile | string[]) => void; toggleSave: (id: string) => void; toggleLike: (id: string) => void; completeCourseLesson: (path: string, lessonIndex: number) => void; isCourseLessonComplete: (path: string, lessonIndex: number) => boolean; resetDemo: () => void;
};
const Context = createContext<State | null>(null); const KEY = 'curious-demo-state-v1';
export const lessonKey = (path: string, lessonIndex: number) => `${path}:${lessonIndex}`;

export function AppStateProvider({ children }: React.PropsWithChildren) {
  const [onboarded, setOnboarded] = useState<boolean | null>(null); const [interests, setInterests] = useState<string[]>([]); const [saved, setSaved] = useState<string[]>([]); const [liked, setLiked] = useState<string[]>([]); const [xp, setXp] = useState(1480); const [streak, setStreak] = useState(14); const [completedLessons, setCompletedLessons] = useState(12); const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  useEffect(() => { AsyncStorage.getItem(KEY).then(raw => { if (raw) { const s = JSON.parse(raw); setOnboarded(true); setInterests(s.interests ?? []); setSaved(s.saved ?? []); setLiked(s.liked ?? []); setXp(s.xp ?? 1480); setStreak(s.streak ?? 14); setCompletedLessons(s.completedLessons ?? 12); setCompletedLessonIds(s.completedLessonIds ?? []); } else setOnboarded(false); }); }, []);
  const snapshot = () => ({ interests, saved, liked, xp, streak, completedLessons, completedLessonIds });
  const persist = (patch: object) => AsyncStorage.getItem(KEY).then(raw => AsyncStorage.setItem(KEY, JSON.stringify({ ...snapshot(), ...(raw ? JSON.parse(raw) : {}), ...patch })));
  const finishOnboarding = (profile: OnboardingProfile | string[]) => { const topics = Array.isArray(profile) ? profile : profile.interests; setInterests(topics); setOnboarded(true); persist({ interests: topics, ...(!Array.isArray(profile) ? { onboardingProfile: profile } : {}) }); };
  const toggleSave = (id: string) => setSaved(value => { const next = value.includes(id) ? value.filter(item => item !== id) : [...value, id]; persist({ saved: next }); return next; });
  const toggleLike = (id: string) => setLiked(value => { const next = value.includes(id) ? value.filter(item => item !== id) : [...value, id]; persist({ liked: next }); return next; });
  const completeCourseLesson = (path: string, lessonIndex: number) => { const key = lessonKey(path, lessonIndex); if (completedLessonIds.includes(key)) return; const nextIds = [...completedLessonIds, key]; const nextXp = xp + 25; const nextCount = completedLessons + 1; setCompletedLessonIds(nextIds); setXp(nextXp); setCompletedLessons(nextCount); persist({ completedLessonIds: nextIds, xp: nextXp, completedLessons: nextCount }); };
  const isCourseLessonComplete = (path: string, lessonIndex: number) => completedLessonIds.includes(lessonKey(path, lessonIndex));
  const resetDemo = () => { AsyncStorage.removeItem(KEY); setOnboarded(false); setInterests([]); setSaved([]); setLiked([]); setXp(1480); setStreak(14); setCompletedLessons(12); setCompletedLessonIds([]); };
  const value = useMemo(() => ({ onboarded, interests, saved, liked, xp, streak, completedLessons, completedLessonIds, finishOnboarding, toggleSave, toggleLike, completeCourseLesson, isCourseLessonComplete, resetDemo }), [onboarded, interests, saved, liked, xp, streak, completedLessons, completedLessonIds]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAppState() { const state = useContext(Context); if (!state) throw new Error('Missing AppStateProvider'); return state; }
export function useRankedFeed() { const { interests, liked, saved } = useAppState(); return [...feed].sort((a, b) => recommendationScore({ topic: b.topic, liked: liked.includes(b.id), saved: saved.includes(b.id), ageHours: 3, quality: .9, difficulty: .5 }, interests) - recommendationScore({ topic: a.topic, liked: liked.includes(a.id), saved: saved.includes(a.id), ageHours: 3, quality: .9, difficulty: .5 }, interests)); }
