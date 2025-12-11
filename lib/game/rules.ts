import type { Difficulty, GameItem } from './items';

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

// helper to get timer by difficulty (in seconds) -fg
export function getTimerForDifficulty(difficulty: Difficulty | string): number { 
  const d = String(difficulty).toLowerCase(); 

  if (d === 'easy') return 15;   // 15 seconds 
  if (d === 'medium') return 10; // 10 seconds 
  return 5;                      // hard = 5 seconds
}

// -fg: simple round builder (picks items by difficulty)
export function buildRound(items: GameItem[], count: number): GameItem[] {
  return items.slice(0, count);
}

// -fg get how many rounds each difficulty should have
export function getTotalRounds(difficulty: 'easy' | 'medium' | 'hard') {
  if (difficulty === 'easy') return 3;
  if (difficulty === 'medium') return 5;
  return 10; // hard
}
