import type { Difficulty } from './items';

let HIGH_SCORES: { score: number; difficulty: Difficulty }[] = [];

export function saveHighScore(score: number, difficulty: Difficulty) {
  HIGH_SCORES.push({ score, difficulty });

  HIGH_SCORES.sort((a, b) => b.score - a.score);

  HIGH_SCORES = HIGH_SCORES.slice(0, 10);
}

export function getHighScores() {
  return HIGH_SCORES;
}

export function clearHighScores() {
  HIGH_SCORES = [];
}
