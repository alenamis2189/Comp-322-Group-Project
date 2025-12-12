import { router } from 'expo-router'; // -fg added useLocalSearchParams
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function DifficultyScreen() {

  /* this function will start the game with the settings for the difficulty 
     we send the difficulty name, the starting time, the number of rounds,
     and we always begin on round 1 */
  function chooseDifficulty(level: 'easy' | 'medium' | 'hard') {

    let time = 0;
    let rounds = 0;

    // set time and number of rounds depending on difficulty 
    if (level === 'easy') {
      time = 15;
      rounds = 3;
    } 
    else if (level === 'medium') {
      time = 10;
      rounds = 5;
    } 
    else {
      time = 5;
      rounds = 10;
    }

    // go to the play screen and send all the info
    router.push({
      pathname: '/playScreen',
      params: {
        difficulty: level,
        startingTime: String(time),
        totalRounds: String(rounds), 
        currentRound: "1",
        scoreSoFar: "0",

        // multi-round game logic -fg
        gameRound: '1',
        gameTotalRounds: String(rounds),
        totalScore: '0',
 
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Difficulty</Text>

      <Pressable style={styles.button} onPress={() => chooseDifficulty('easy')}>
        <Text style={styles.buttonText}>Easy</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => chooseDifficulty('medium')}>
        <Text style={styles.buttonText}>Medium</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => chooseDifficulty('hard')}>
        <Text style={styles.buttonText}>Hard</Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
        <Text style={styles.backButtonText}>Back to Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7'
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 45,
    letterSpacing: 0.5,
    color: '#222'
  },
  button: {
    backgroundColor: '#007AFF',
    width: 240,
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3
  },
  buttonText: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '600',
    letterSpacing: 0.4
  },
  backButton: {
    marginTop: 28,
    width: 240,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#555',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3
  }
});
