import type { GameItem, Difficulty } from './items';

export type Decision = 'pass' | 'no-pass';

export type AnswerRecord = {
item: GameItem;
decision: Decision;
isCorrect: boolean;
timestamp: number;
};

const CORRECT_POINTS = 1;
const WRONG_POINTS = -1;

export function isCorrectDecision(
        item: GameItem,
        decision: Decision
): boolean {
    return (
            (decision === 'pass' && !item.isProhibited) ||
                    (decision === 'no-pass' && item.isProhibited)
    );
}

export function getScoreDelta(
        item: GameItem,
        decision: Decision
): number {
    return isCorrectDecision(item, decision)
        ? CORRECT_POINTS
        : WRONG_POINTS;
}

export function getTimerForDifficulty(difficulty: string): number {
    switch (difficulty.toLowerCase()) {
        case 'easy': return 60;
        case 'medium': return 45;
        case 'hard': return 30;
        default: return 60;
    }
}

export function calculateStreakBonus(streak: number): number {
    if (streak < 2) return 0;
    if (streak < 5) return Math.floor(streak / 2);
    return Math.floor(streak * 0.5);
}

export function calculateReactionBonus(reactionTime: number): number {
    // Bonus points for quick reactions (under 1 second = 0.5 bonus, under 0.5s = 1 bonus)
    if (reactionTime < 500) return 1;
    if (reactionTime < 1000) return 0.5;
    return 0;
}

export type RoundSummary = {
difficulty: Difficulty;
totalItems: number;
correctCount: number;
incorrectCount: number;
};

export function summarizeRound(
difficulty: Difficulty,
answers: AnswerRecord[]
): RoundSummary {
  const totalItems = answers.length;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const incorrectCount = totalItems - correctCount;

    return {
            difficulty,
            totalItems,
            correctCount,
            incorrectCount,
    };
}
