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
