import { saveHighScore } from '@/lib/game/highscores';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ScoreScreen() {
  // read round + session scores and difficulty from params -fg
  const params = useLocalSearchParams();
  // if there's a score in the round, convert to number, otherwise 0 -fg
  const roundScore = params.roundScore ? Number(params.roundScore) : 0; // -fg
  const totalScore = params.totalScore ? Number(params.totalScore) : 0; // -fg

  // if there's a difficulty assigned, convert to string, otherwise default to easy -fg
  const difficulty = params.difficulty ? String(params.difficulty) : 'easy'; // -fg

  // to keep track of how many rounds has it been, default to 1 if nothing is passed -fg
  const gameRound = params.gameRound ? Number(params.gameRound) : 1; // -fg

  // try to read total rounds from params if passed, otherwise decide by difficulty -fg
  let gameTotalRounds = params.gameTotalRounds
    ? Number(params.gameTotalRounds)
    : 1; // -fg

  // if no total rounds passed, fall back to difficulty-based rounds -fg
  if (!params.gameTotalRounds) { // -fg
    if (difficulty === 'easy') {
      gameTotalRounds = 3; // -fg
    } else if (difficulty === 'medium') {
      gameTotalRounds = 5; // -fg
    } else if (difficulty === 'hard') {
      gameTotalRounds = 10; // -fg
    }
  }

  // last round = if the number of rounds is the same or bigger than total rounds -fg
  const isLastRound = gameRound >= gameTotalRounds; 

    // when the last round finishes, save high score to supabase -fg
  useEffect(() => {
    // only run when this is the final results screen -fg
    if (!isLastRound) {
      return; 
    }

    async function pushHighScore() { // -fg
      try {
        console.log('saving highscore for final score', totalScore, 'difficulty', difficulty); // -fg
        await saveHighScore(totalScore, difficulty); // -fg
      } catch (e) {
        console.log('error saving highscore', e); 
      }
    }

    pushHighScore(); // -fg
  }, [isLastRound, totalScore, difficulty]); // -fg

  // automatically go to next round if more rounds left -fg
  useEffect(() => {
    // if we aren't in the last round -fg
    if (gameRound < gameTotalRounds) {
      // set timer of 2.5 seconds -fg
      const timer = setTimeout(() => {
        // go back into the play screen for the next round -fg
        router.replace({
          pathname: '/playScreen',
          params: {
            difficulty,
            gameRound: String(gameRound + 1), // move to next round -fg
            gameTotalRounds: String(gameTotalRounds), // keep total rounds -fg
            totalScore: String(totalScore), // keep cumulative score -fg
          },
        });
      }, 2500); // small delay so player sees results -fg

      // to clear up the timer and avoid bugs -fg
      return () => clearTimeout(timer);
    }
    // if it's the last round, we don't auto-navigate, we just show final results -fg
  }, [gameRound, gameTotalRounds, difficulty, totalScore]); // -fg

  function goToNextRound() {
    // if this was the last round, finish the game (for now go back to start) -fg
    if (gameRound >= gameTotalRounds) {
      router.replace('/'); // could also go to '/highScores' later -fg
      return;
    }

    // keep counter of next round -fg
    const nextRound = gameRound + 1; // -fg

    router.replace({
      pathname: '/playScreen',
      params: {
        difficulty,
        gameRound: String(nextRound), // go to next round -fg
        gameTotalRounds: String(gameTotalRounds),
        totalScore: String(totalScore), // keep cumulative score -fg
      },
    });
  }

  function playAgain() {
    // start a new game by choosing difficulty again -fg
    router.replace('/difficulty'); // -fg
  }

  function backtoIndex() {
    router.replace('/'); // -fg
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { marginBottom: isLastRound ? 5 : 40 }]}>
        {isLastRound ? 'Final Results' : 'Next round starting...'}
      </Text>

      {isLastRound ? (
        <>
          {/* difficulty and final score -fg */}
          <Text style={styles.difficulty}>Difficulty: {difficulty}</Text>
          <Text style={styles.score}>{totalScore}</Text>

          {/* summary of total score and round info -fg */}
          <Text style={styles.roundSummary}>
            {`Total Score: ${totalScore}`}
          </Text>
          <Text style={styles.roundSummary}>
            {`Round: ${gameRound} / ${gameTotalRounds}`}
          </Text>

          {/* finish game button (go back to start for now) -fg */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToNextRound}
          >
            <Text style={styles.buttonText}>Finish Game</Text>
          </Pressable>
        </>
      ) : (
        <>
          {/* transition info between rounds -fg */}
          <View style={styles.nextRoundSpacing}>
            <Text style={styles.roundSummary}>
              {`Total Score: ${totalScore}`}
            </Text>
            <Text style={styles.roundSummary}>
              {`Round: ${gameRound} / ${gameTotalRounds}`}
            </Text>
          </View>
        </>
      )}

      {/* buttons only showing if it's the last round -fg */}
      {isLastRound && (
        <>
          {/* Primary Button - play again -fg */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={playAgain}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </Pressable>

          {/* Secondary Button - back to start -fg */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={backtoIndex}
          >
            <Text style={styles.secondaryButtonText}>Back to Start</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 10,
  },
  difficulty: { fontSize: 26, fontWeight: '600', color: '#444', marginBottom: 20 }, // -fg
  score: {
    fontSize: 90,
    fontWeight: '900',
    color: '#007AFF', // Score in primary blue
    marginBottom: 40,
  },
  roundSummary: {
    fontSize: 26,
    fontWeight: '500',
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  nextRoundSpacing: {
    marginBottom: 30,
  },
  // Consistent Button Styling
  button: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
    minWidth: 250,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  buttonPressed: {
    opacity: 0.85, // feedback on press
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#333333',
    fontSize: 24,
    fontWeight: '700',
  },
});
