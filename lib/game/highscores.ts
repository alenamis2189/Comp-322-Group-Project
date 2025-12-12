import { supabase } from '../supabaseScore';

// to match supabase table data -fg
export type HighScoreRow = {
  id: string;
  score: number;
  difficulty: string;
  created_at: string;
};

/**
 * save a new high score row to supabase
 * score: total score of the session
 * difficulty: 'easy' | 'medium' | 'hard'
 * -fg
 */
export async function saveHighScore(
  score: number,
  difficulty: string,
) {
  const { error } = await supabase
    .from('tsaHighScores') // table name -fg
    .insert({
      score,
      difficulty,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.log('Error saving highscore', error.message);
  }
}

/**
 * load top 10 high scores from supabase
 */
export async function fetchTopHighScores(
  limit: number = 10
): Promise<HighScoreRow[]> {
  const { data, error } = await supabase
    .from('tsaHighScores') // same table -fg
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.log('supabase: error loading highscores', error.message);
    return [];
  }

  return (data || []) as HighScoreRow[];
}
