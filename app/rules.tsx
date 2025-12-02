import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';

export default function RulesScreen() {
  
  function goBack() {
    router.back();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How to Play TSA Security Game</Text>
        
        {/* Game Rules Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎮 Game Rules</Text>
          <Text style={styles.ruleText}>• Tap PROHIBITED items to earn +1 point</Text>
          <Text style={styles.ruleText}>• Avoid tapping safe items (-1 point penalty)</Text>
          <Text style={styles.ruleText}>• Find all prohibited items before time runs out</Text>
          <Text style={styles.ruleText}>• Build streaks for bonus points</Text>
          <Text style={styles.ruleText}>• React quickly for time bonuses</Text>
          <Text style={styles.ruleText}>• Use the pause button if needed</Text>
        </View>

        {/* Scoring System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Scoring System</Text>
          <Text style={styles.scoreText}>Base Points: +1 for prohibited, -1 for safe</Text>
          <Text style={styles.scoreText}>Streak Bonus: Up to +3 points for consecutive correct taps</Text>
          <Text style={styles.scoreText}>Speed Bonus: Extra points for quick reactions</Text>
          <Text style={styles.scoreText}>Accuracy Tracking: Percentage of correct taps</Text>
        </View>

        {/* Prohibited Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔴 Prohibited Items (TAP THESE)</Text>
          <View style={styles.itemsGrid}>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>🔫 Gun</Text>
              <Text style={styles.itemDesc}>Firearms are strictly prohibited</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>🔪 Knife</Text>
              <Text style={styles.itemDesc}>Sharp weapons not allowed</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>✂️ Scissors</Text>
              <Text style={styles.itemDesc}>Sharp cutting tools prohibited</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>� Ammunition</Text>
              <Text style={styles.itemDesc}>Explosive materials banned</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>🔥 Lighter</Text>
              <Text style={styles.itemDesc}>Fire-starting devices prohibited</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>💧 Large Water Bottle</Text>
              <Text style={styles.itemDesc}>Over 100ml liquid limit</Text>
            </View>
          </View>
        </View>

        {/* Safe Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🟢 Safe Items (DO NOT TAP)</Text>
          <View style={styles.itemsGrid}>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>💻 Laptop</Text>
              <Text style={styles.itemDesc}>Electronics are allowed in carry-on</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>🪥 Toothbrush</Text>
              <Text style={styles.itemDesc}>Personal hygiene items OK</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>📚 Book</Text>
              <Text style={styles.itemDesc}>Reading materials permitted</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>👕 T-shirt</Text>
              <Text style={styles.itemDesc}>Clothing items allowed</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>🍿 Snacks</Text>
              <Text style={styles.itemDesc}>Solid food items generally OK</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>⚾ Baseball</Text>
              <Text style={styles.itemDesc}>Sports balls are permitted</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>☂️ Umbrella</Text>
              <Text style={styles.itemDesc}>Weather protection items OK</Text>
            </View>
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>🔋 Power Bank</Text>
              <Text style={styles.itemDesc}>Portable chargers allowed in carry-on</Text>
            </View>
          </View>
        </View>

        {/* Difficulty Levels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Difficulty Levels</Text>
          <View style={styles.difficultyCard}>
            <Text style={styles.difficultyName}>🟢 Easy</Text>
            <Text style={styles.difficultyDesc}>3 rounds, more time, obvious items</Text>
          </View>
          <View style={styles.difficultyCard}>
            <Text style={styles.difficultyName}>🟡 Medium</Text>
            <Text style={styles.difficultyDesc}>5 rounds, moderate time, mixed items</Text>
          </View>
          <View style={styles.difficultyCard}>
            <Text style={styles.difficultyName}>🔴 Hard</Text>
            <Text style={styles.difficultyDesc}>10 rounds, less time, challenging items</Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Pro Tips</Text>
          <Text style={styles.tipText}>• Study the prohibited items list carefully</Text>
          <Text style={styles.tipText}>• Look for sharp, dangerous, or weapon-like objects</Text>
          <Text style={styles.tipText}>• When in doubt, think: "Would TSA confiscate this?"</Text>
          <Text style={styles.tipText}>• Build accuracy before focusing on speed</Text>
          <Text style={styles.tipText}>• Use the pause feature to take breaks</Text>
        </View>

        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={goBack}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  ruleText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    lineHeight: 22,
  },
  scoreText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  tipText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    width: '48%',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  difficultyCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  difficultyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  difficultyDesc: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});