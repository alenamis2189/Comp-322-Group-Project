import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {

  // Corrected to use '/play' path based on your _layout.tsx
  function startTSAGame(){
    router.push('/difficulty');
  }
  function seeHighScores(){
    router.push('/highScores');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TSA Luggage Check</Text>
      <Text style={styles.subtitle}>Test your security skills!</Text>
      
      {/* Start Button with press feedback */}
      <Pressable 
        onPress={startTSAGame}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} 
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </Pressable>
      {/* High Score Button */}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Clean background
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF', // Primary Blue
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.85, // Feedback on press
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});
