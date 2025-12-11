import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// simple high scores screen with mock data for now
export default function HighScoresScreen() {
  const [scores, setScores] = useState<{ score: number; difficulty: string }[]>([]);

  useEffect(() => {
    // mock data for presentation only
    const mockScores = [
      { score: 50, difficulty: 'hard' },
      { score: 48, difficulty: 'hard' },
      { score: 45, difficulty: 'hard' },
      { score: 41, difficulty: 'hard' },
      { score: 38, difficulty: 'hard' },
      { score: 15, difficulty: 'medium' },
      { score: 14, difficulty: 'medium' },
      { score: 12, difficulty: 'medium' },
      { score: 6, difficulty: 'easy' },
      { score: 5, difficulty: 'easy' },
    ];

    setScores(mockScores);
  }, []);

  // go back to start screen
  function goBack() {
    router.replace('/');
  }

  // clear scores only in ui for now
  function clearScores() {
    setScores([]);
  }

  // pick a small color accent per difficulty
  function getDifficultyStyle(diff: string) {
    if (diff === 'hard') return styles.hard;
    if (diff === 'medium') return styles.medium;
    return styles.easy;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>

      {scores.length === 0 ? (
        <Text style={styles.emptyText}>No Scores Yet!</Text>
      ) : (
        <View style={styles.card}>
          <ScrollView>
            {scores.map((s, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.rank}>{i + 1}.</Text>
                <Text style={styles.score}>{s.score} pts</Text>
                <Text style={[styles.difficulty, getDifficultyStyle(s.difficulty)]}>
                  {s.difficulty.toUpperCase()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={clearScores}
        >
          <Text style={styles.secondaryText}>Clear Scores</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={goBack}
        >
          <Text style={styles.primaryText}>Back to Start</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // main screen layout
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  // screen title
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#222',
    letterSpacing: 0.8,
    marginBottom: 18,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 40, // some more space before the buttons
  },

  // white card where scores live
  card: {
    width: 300,
    maxHeight: 320,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },

  // each row in the list
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },

  rank: {
    width: 30,
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },

  score: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  difficulty: {
    fontSize: 14,
    fontWeight: '700',
  },

  // small color accents per difficulty
  hard: {
    color: '#d9534f', // red-ish
  },
  medium: {
    color: '#f0ad4e', // orange-ish
  },
  easy: {
    color: '#5cb85c', // green-ish
  },

  // bottom buttons row
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },

  primaryButton: {
    backgroundColor: '#007AFF',
  },

  secondaryButton: {
    backgroundColor: '#E5E5EA',
  },

  buttonPressed: {
    opacity: 0.9,
  },

  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
