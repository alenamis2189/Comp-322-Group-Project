import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchTopHighScores, HighScoreRow } from '../lib/game/highscores'; // -fg

// simple high scores screen
export default function HighScoresScreen() {
  const [scores, setScores] = useState<HighScoreRow[]>([]); // -fg
  const [loading, setLoading] = useState(true); // -fg

  useEffect(() => {
    async function loadScores() { // -fg
      setLoading(true); // -fg
      const data = await fetchTopHighScores(10); // -fg
      console.log('loaded highscores from supabase:', data); // -fg
      setScores(data); // -fg
      setLoading(false); // -fg
    } // -fg

    loadScores(); // -fg
  }, []); // -fg

  // go back to start screen
  function goBack() {
    router.replace('/');
  }

  // clear scores only in ui for now
  function clearScores() {
    setScores([]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
      ) : scores.length === 0 ? (
        <Text style={styles.emptyText}>No Scores Yet!</Text>
      ) : (
        <ScrollView
          style={styles.list} // scrollable area -fg
          contentContainerStyle={styles.listContent} // -fg
          showsVerticalScrollIndicator={false}
        >
          {scores.map((row, index) => {
            return (
              <View key={row.id} style={styles.card}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.difficultyPill}>{row.difficulty.toUpperCase()}</Text>
                  <Text style={styles.scoreLabel}>{row.score} pts</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
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
    backgroundColor: '#F2F4F8',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },

  // scroll area
  list: {
    flex: 1,
    marginBottom: 20,
  },

  listContent: {
    alignItems: 'center',
    paddingBottom: 16,
  },

  // screen title
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.6,
    marginBottom: 18,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 40,
    textAlign: 'center',
  },

  card: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 12,
  },

  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0ECFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  rankText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C6FEA',
  },

  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  difficultyPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#F0F1F5',
    fontSize: 13,
    fontWeight: '700',
    color: '#444',
  },

  scoreLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },

  // bottom buttons row
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 340,
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 32,
    columnGap: 20,
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
