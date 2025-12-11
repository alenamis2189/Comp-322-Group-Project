import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {

  // Start game
  function startTSAGame(){
    router.push('/difficulty');
  }
  function seeHighScores(){
    router.push('/highScores');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✈️</Text>
      <Text style={styles.title}>TSA Bag Ready</Text>
      <Text style={styles.subtitle}>Test your security skills!</Text>
      
      {/* Start Button with press feedback */}
      <Pressable 
        onPress={startTSAGame}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} 
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </Pressable>
      {/* go to high scores screen */}
      <Pressable 
        onPress={seeHighScores}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} 
      >
        <Text style={styles.buttonText}>High Scores</Text>
      </Pressable>


    </View>
  );
};

// Styles for a clean, bold start screen
const styles = StyleSheet.create({
  icon: {
    fontSize: 44,
    marginBottom: 6,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Clean background
    padding: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 17,
    color: '#777777',
    marginBottom: 55,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  button: {
    backgroundColor: '#007AFF', // primary blue
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    minWidth: 220,
    alignItems: 'center',
    marginBottom: 14, // space between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.85, // Feedback on press
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.4, // subtle polish
  },
});

