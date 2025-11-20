import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ScoreScreen(){
    // read round + session scores and difficulty from params -fg
    const params = useLocalSearchParams();
    const roundScore = params.roundScore ? Number(params.roundScore) : 0; 
    const totalScore = params.totalScore ? Number(params.totalScore) : 0; 
    const difficulty = params.difficulty ? String(params.difficulty) : 'easy'; 
    const gameRound = params.gameRound ? Number(params.gameRound) : 1; 

    // set rounds by difficulty -fg
    let gameTotalRounds = 1;
    if (difficulty === 'easy'){
        gameTotalRounds = 3;
    } else if (difficulty === 'medium'){
        gameTotalRounds = 5;
    } else if (difficulty === 'hard'){
        gameTotalRounds = 10;
    }

    const isLastRound = gameRound >= gameTotalRounds;

    // automatically go to next round if more rounds left -fg
    useEffect(() => {
      if (gameRound < gameTotalRounds) {
        const timer = setTimeout(() => {
          router.replace({
            pathname: '/playScreen',
            params: {
              difficulty,
              gameRound: String(gameRound + 1),
              gameTotalRounds: String(gameTotalRounds),
              totalScore: String(totalScore),
            },
          });
        }, 2500); // small delay so player sees results -fg

        return () => clearTimeout(timer);
      }
    }, [gameRound, gameTotalRounds, difficulty, totalScore]);

    function goToNextRound() { 
      // if this was the last round, finish the game (for now go back to start) -fg
      if (gameRound >= gameTotalRounds) {
        router.replace('/'); // could also go to '/highscores' later -fg
        return;
      }

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

    function playAgain(){
        // start a new game by choosing difficulty again -fg
        router.replace('/difficulty'); 
    }

    function backtoIndex(){
        router.replace('/');
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
              {isLastRound ? 'Final Results' : 'Round Complete'}
            </Text>
            <Text style={styles.subtitle}>Score this round:</Text>
            <Text style={styles.difficulty}>Difficulty: {difficulty}</Text> 
            <Text style={styles.score}>{totalScore}</Text>
            <Text style={styles.roundSummary}>
              {`Total Score: ${totalScore}`}
            </Text>
            <Text style={styles.roundSummary}>
              {`Round: ${gameRound} / ${gameTotalRounds}`}
            </Text>

            {!isLastRound ? (
              <Text style={styles.roundSummary}>Next round starting...</Text> //loading next round -fg
            ) : (
              <Pressable
                style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.buttonPressed]}
                onPress={goToNextRound}
              >
                <Text style={styles.buttonText}>Finish Game</Text>
              </Pressable>
            )}

            {isLastRound && (
              <>
                {/* Primary Button */}
                <Pressable 
                    style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.buttonPressed]} 
                    onPress={playAgain}
                >
                    <Text style={styles.buttonText}>Play Again</Text>
                </Pressable>

                {/* Secondary Button */}
                <Pressable 
                    style={({ pressed }) => [styles.button, styles.secondaryButton, pressed && styles.buttonPressed]} 
                    onPress={backtoIndex}
                >
                    <Text style={styles.secondaryButtonText}>Back to Start</Text>
                </Pressable>
              </>
            )}
        </View>
    )
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
        fontSize: 36, 
        fontWeight: '800', 
        color: '#333333',
        marginBottom: 5, 
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#666666',
        marginBottom: 10,
    },
    difficulty: { fontSize: 18, fontWeight: '600', color: '#444', marginBottom: 20 }, // -fg
    score: { 
        fontSize: 72, 
        fontWeight: '900', 
        color: '#007AFF', // Score in primary blue
        marginBottom: 40, 
    },
    roundSummary: {
      fontSize: 18,
      fontWeight: '500',
      color: '#555',
      marginBottom: 20,
      textAlign: 'center',
    },
    // Consistent Button Styling
    button: { 
        paddingVertical: 15, 
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
        opacity: 0.85, // Feedback on press
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 20,
        fontWeight: '700',
    },
    secondaryButtonText: {
        color: '#333333',
        fontSize: 20,
        fontWeight: '700',
    },
});
