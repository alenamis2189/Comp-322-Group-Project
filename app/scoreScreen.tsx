import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { addHighScore } from ‘../lib/game/highScores’;
import type { Difficulty } from ‘../lib/game/items’;

export default function ScoreScreen(){
    // read round + session scores and difficulty from params -fg
    const params = useLocalSearchParams();

    // if there's a score in the round, convert to number, otherwise 0
    const roundScore = params.roundScore ? Number(params.roundScore) : 0; 
    const totalScore = params.totalScore ? Number(params.totalScore) : 0; 

    // Enhanced stats from new scoring system
    const accuracy = params.accuracy ? Number(params.accuracy) : 0;
    const maxStreak = params.maxStreak ? Number(params.maxStreak) : 0;
    const averageReactionTime = params.averageReactionTime ? Number(params.averageReactionTime) : 0;
    const totalTaps = params.totalTaps ? Number(params.totalTaps) : 0;
    const correctTaps = params.correctTaps ? Number(params.correctTaps) : 0;

    // if there's a difficulty assigned, convert to string, otherwise default to easy
    const difficulty = params.difficulty ? String(params.difficulty) : 'easy'; 

    // to keep track of how many rounds has it been, default to 1 if nothing is passed
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
    // last round = if the number of rounds is the same or biggger than total rounds -fg
    const isLastRound = gameRound >= gameTotalRounds;

    // automatically go to next round if more rounds left -fg
    useEffect(() => {

      // if we aren't in the last round
      if (gameRound < gameTotalRounds) {

        // set timer of 2.5 seconds 
        const timer = setTimeout(() => {
          // show transition screen
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

        // to clear up the timer and avoid bugs
        return () => clearTimeout(timer);
      }

      // check if any of these variables changed
    }, [gameRound, gameTotalRounds, difficulty, totalScore]);

    function goToNextRound() { 
      // if this was the last round, finish the game (for now go back to start) -fg
      if (gameRound >= gameTotalRounds) {
        router.replace('/'); // could also go to '/highscores' later -fg
        return;
      }

      // keep counter of next round -fg
      const nextRound = gameRound + 1;

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
            <Text style={[styles.title, {marginBottom: isLastRound ? 5 : 40}]}>
              {isLastRound ? 'Final Results' : 'Next round starting...'}
            </Text>

            {isLastRound ? (
              <>
                {/* <Text style={styles.subtitle}>Score this round:</Text> */}
                <Text style={styles.difficulty}>Difficulty: {difficulty}</Text>
                <Text style={styles.score}>{totalScore}</Text>
                
                {/* Enhanced Stats Display */}
                <View style={styles.statsContainer}>
                  <Text style={styles.statsTitle}>Round Performance</Text>
                  
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{accuracy}%</Text>
                      <Text style={styles.statLabel}>Accuracy</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{maxStreak}</Text>
                      <Text style={styles.statLabel}>Max Streak</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{averageReactionTime}ms</Text>
                      <Text style={styles.statLabel}>Avg Reaction</Text>
                    </View>
                  </View>
                  
                  <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{correctTaps}/{totalTaps}</Text>
                      <Text style={styles.statLabel}>Correct Taps</Text>
                    </View>
                    <View style={styles.statBox}>
                      <Text style={styles.statValue}>{roundScore}</Text>
                      <Text style={styles.statLabel}>Round Score</Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.roundSummary}>
                  {`Total Score: ${totalScore}`}
                </Text>
                <Text style={styles.roundSummary}>
                  {`Round: ${gameRound} / ${gameTotalRounds}`}
                </Text>

                <Pressable
                  style={({ pressed }) => [styles.button, styles.primaryButton, pressed && styles.buttonPressed]}
                  onPress={goToNextRound}
                >
                  <Text style={styles.buttonText}>Finish Game</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.nextRoundSpacing}>
                  {/* Quick stats for non-final rounds */}
                  <View style={styles.quickStats}>
                    <Text style={styles.quickStatText}>Accuracy: {accuracy}% | Streak: {maxStreak} | Score: +{roundScore}</Text>
                  </View>
                  
                  <Text style={styles.roundSummary}>
                    {`Total Score: ${totalScore}`}
                  </Text>
                  <Text style={styles.roundSummary}>
                    {`Round: ${gameRound} / ${gameTotalRounds}`}
                  </Text>
                </View>
              </>
            )}
            {/* buttons only showing if it's the last round */}
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
    // Enhanced Stats Styling
    statsContainer: {
      backgroundColor: '#F8F9FA',
      padding: 20,
      borderRadius: 15,
      marginBottom: 25,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statsTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#333',
      textAlign: 'center',
      marginBottom: 15,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 15,
    },
    statBox: {
      alignItems: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '800',
      color: '#007AFF',
      marginBottom: 5,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: '#666',
      textAlign: 'center',
    },
    quickStats: {
      backgroundColor: '#E8F4FD',
      padding: 12,
      borderRadius: 10,
      marginBottom: 15,
    },
    quickStatText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#007AFF',
      textAlign: 'center',
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
        opacity: 0.85, // Feedback on press
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
