export type Signal = {
  topic: string;
  completion?: number;
  liked?: boolean;
  saved?: boolean;
  skipped?: boolean;
  ageHours: number;
  quality: number;
  difficulty: number;
};

export function recommendationScore(signal: Signal, interests: string[], knowledge = 0.45) {
  const interest = interests.includes(signal.topic) ? 2.4 : 0;
  const engagement = (signal.completion ?? 0) * 1.4 + (signal.liked ? 1.1 : 0) + (signal.saved ? 1.8 : 0) - (signal.skipped ? 1.5 : 0);
  const freshness = Math.exp(-signal.ageHours / 168) * 1.2;
  const difficultyFit = 1 - Math.min(1, Math.abs(signal.difficulty - knowledge));
  return interest + engagement + freshness + signal.quality * 1.6 + difficultyFit;
}
