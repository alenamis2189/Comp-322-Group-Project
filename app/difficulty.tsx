import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';

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
        scoreSoFar: "0"
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>select difficulty</Text>
      // options to click - difficulty
      <Pressable style={styles.button} onPress={() => chooseDifficulty('easy')}>
        <Text style={styles.buttonText}>easy</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => chooseDifficulty('medium')}>
        <Text style={styles.buttonText}>medium</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => chooseDifficulty('hard')}>
        <Text style={styles.buttonText}>hard</Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
        <Text style={styles.backButtonText}>back to start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 40
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600'
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    backgroundColor: '#555'
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500'
  }
});
