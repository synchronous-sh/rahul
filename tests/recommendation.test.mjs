import test from 'node:test';
import assert from 'node:assert/strict';

function score(s, interests, knowledge = .45) { const interest = interests.includes(s.topic) ? 2.4 : 0; const engagement = (s.completion ?? 0) * 1.4 + (s.liked ? 1.1 : 0) + (s.saved ? 1.8 : 0) - (s.skipped ? 1.5 : 0); const freshness = Math.exp(-s.ageHours / 168) * 1.2; const difficultyFit = 1 - Math.min(1, Math.abs(s.difficulty - knowledge)); return interest + engagement + freshness + s.quality * 1.6 + difficultyFit; }
test('interests and saves rank content higher', () => { const base = { topic: 'AI', ageHours: 4, quality: .8, difficulty: .5 }; assert.ok(score({ ...base, saved: true }, ['AI']) > score({ ...base, topic: 'Sports' }, ['AI'])); });
test('fresh content outranks stale equivalent content', () => { const base = { topic: 'AI', quality: .8, difficulty: .5 }; assert.ok(score({ ...base, ageHours: 1 }, []) > score({ ...base, ageHours: 720 }, [])); });
