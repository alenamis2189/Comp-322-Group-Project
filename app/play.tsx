/* app/play.tsx
   Play screen with always-visible info bar, tap feedback, and dark/light theming.
*/
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  useColorScheme,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

export default function PlayScreen() {
  const colorScheme = useColorScheme() || 'light';
  const styles = themedStyles(colorScheme);

  // /* setting up the amount of time per round */
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  // game state: list of items, current index, and score
  type Item = {
    id: string;
    text: string;
    correct: boolean;
    imageUrl?: string; // Optional: for web URLs
    imagePath?: any; // Optional: for local require() paths
  };

  const items: Item[] = useMemo(
    () => [
      // safe items
      { id: 'book', text: 'Book', correct: false, imageUrl: 'https://via.placeholder.com/150x150/4CAF50/white?text=📚' },
      { id: 'tshirt', text: 'T-shirt', correct: false, imageUrl: 'https://via.placeholder.com/150x150/2196F3/white?text=👕' },
      { id: 'laptop', text: 'Laptop', correct: false, imageUrl: 'https://via.placeholder.com/150x150/607D8B/white?text=💻' },
      { id: 'headphones', text: 'Headphones', correct: false, imageUrl: 'https://via.placeholder.com/150x150/9C27B0/white?text=🎧' },
      { id: 'toothbrush', text: 'Toothbrush', correct: false, imageUrl: 'https://via.placeholder.com/150x150/00BCD4/white?text=🪥' },
      { id: 'sunglasses', text: 'Sunglasses', correct: false, imageUrl: 'https://via.placeholder.com/150x150/FF9800/white?text=🕶️' },
      { id: 'charger', text: 'Phone charger', correct: false, imageUrl: 'https://via.placeholder.com/150x150/795548/white?text=🔌' },
      { id: 'snacks', text: 'Snacks', correct: false, imageUrl: 'https://via.placeholder.com/150x150/8BC34A/white?text=🍿' },
      { id: 'shoes', text: 'Shoes', correct: false, imageUrl: 'https://via.placeholder.com/150x150/3F51B5/white?text=👟' },
      { id: 'umbrella', text: 'Umbrella', correct: false, imageUrl: 'https://via.placeholder.com/150x150/E91E63/white?text=☂️' },
      // prohibited items
      { id: 'knife', text: 'Knife', correct: true, imageUrl: 'https://via.placeholder.com/150x150/F44336/white?text=🔪' },
      { id: 'scissors', text: 'Large Scissors', correct: true, imageUrl: 'https://via.placeholder.com/150x150/FF5722/white?text=✂️' },
      { id: 'gun', text: 'Gun', correct: true, imageUrl: 'https://via.placeholder.com/150x150/D32F2F/white?text=🔫' },
      { id: 'ammunition', text: 'Ammunition', correct: true, imageUrl: 'https://via.placeholder.com/150x150/B71C1C/white?text=💥' },
      { id: 'water', text: 'Water Bottle (500mL)', correct: true, imageUrl: 'https://via.placeholder.com/150x150/1976D2/white?text=🍼' },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // difficulty could come from params or state; for now, keep a simple constant
  const difficulty = 'Normal'; // <-- change or wire to params if needed

  // start the timer when the screen first appears (run once)
  useEffect(() => {
    let timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace({ pathname: '/score', params: { score } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // handle security decision on the current item
  function handleDecision(decision: 'pass' | 'no-pass') {
    const isCorrectDecision =
      (decision === 'pass' && !currentItem!.correct) || (decision === 'no-pass' && currentItem!.correct);

    setScore((s: number) => s + (isCorrectDecision ? 1 : -1));

    // move to next item
    setCurrentIndex((i: number) => {
      const next = i + 1;
      if (next >= items.length) {
        const final = isCorrectDecision ? score + 1 : score - 1;
        router.replace({ pathname: '/score', params: { score: final } });
        return i;
      }
      return next;
    });
  }

  // small haptic helper - only runs on platforms that support it
  async function doHaptic() {
    try {
      // selection is short and subtle
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Haptics.selectionAsync();
      }
    } catch (e) {
      // ignore haptic errors silently
    }
  }

  const currentItem = items[currentIndex];

  const round = Math.min(currentIndex + 1, items.length);

  return (
    <View style={styles.container}>
      {/* Info Bar (always visible) */}
      <View style={styles.infoBar}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>⏱</Text>
          <Text style={styles.infoText}>{secondsRemaining}s</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>🏆</Text>
          <Text style={styles.infoText}>{score}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>🔁</Text>
          <Text style={styles.infoText}> {round}/{items.length}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>⚙️</Text>
          <Text style={styles.infoText}>{difficulty}</Text>
        </View>
      </View>

      {/* Main Content Card */}
      {currentItem ? (
        <View style={styles.cardContainer}>
          {/* Item Display Card - Non-interactive */}
          <View style={styles.itemDisplayCard}>
            {/* Item Image */}
            {currentItem.imageUrl && (
              <Image source={{ uri: currentItem.imageUrl }} style={styles.itemImage} resizeMode="cover" />
            )}
            {/* Fallback: Local image using require */}
            {currentItem.imagePath && !currentItem.imageUrl && (
              <Image source={currentItem.imagePath} style={styles.itemImage} resizeMode="cover" />
            )}

            <Text style={styles.itemText}>{currentItem.text}</Text>
            <Text style={styles.instruction}>Security Decision Required</Text>
          </View>

          {/* Pass/No Pass Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              onPressIn={() => doHaptic()}
              onPress={() => handleDecision('pass')}
              style={({ pressed }) => [
                styles.decisionButton,
                styles.passButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.passButtonText}>✅ PASS</Text>
              <Text style={styles.buttonSubtext}>Allow through</Text>
            </Pressable>

            <Pressable
              onPressIn={() => doHaptic()}
              onPress={() => handleDecision('no-pass')}
              style={({ pressed }) => [
                styles.decisionButton,
                styles.noPassButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.noPassButtonText}>❌ NO PASS</Text>
              <Text style={styles.buttonSubtext}>Confiscate item</Text>
            </Pressable>
          </View>

          <Text style={styles.remaining}>Items Left: {items.length - currentIndex - 1}</Text>
        </View>
      ) : (
        <Text style={styles.itemText}>Processing Results...</Text>
      )}
    </View>
  );
}

/* Themed styles generator so colors adapt to light/dark modes */
const themedStyles = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';

  const colors = {
    background: isDark ? '#0B0B0E' : '#FFFFFF',
    card: isDark ? '#111217' : '#F0F0F0',
    primary: isDark ? '#7AA8FF' : '#007AFF',
    text: isDark ? '#E6E7EA' : '#222222',
    subtext: isDark ? '#AEB3BD' : '#666666',
    pass: '#4CAF50',
    noPass: '#F44336',
    infoBarBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 50,
      paddingHorizontal: 20,
    },
    infoBar: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: colors.infoBarBg,
      borderRadius: 12,
      marginBottom: 18,
      // slight shadow for elevation
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    infoLabel: {
      fontSize: 14,
      marginRight: 6,
    },
    infoText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
    },

    cardContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 500,
      alignSelf: 'center',
    },
    itemDisplayCard: {
      backgroundColor: colors.card,
      padding: 30,
      borderRadius: 15,
      width: '100%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 5,
      marginBottom: 20,
    },
    itemImage: {
      width: 120,
      height: 120,
      borderRadius: 10,
      marginBottom: 15,
    },
    itemText: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 10,
      textAlign: 'center',
    },
    instruction: {
      color: colors.subtext,
      fontSize: 16,
      fontStyle: 'italic',
    },

    buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      gap: 15,
      marginBottom: 10,
    },
    decisionButton: {
      flex: 1,
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    passButton: {
      backgroundColor: '#4CAF50',
    },
    noPassButton: {
      backgroundColor: '#F44336',
    },
    buttonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.985 }],
    },
    passButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 2,
    },
    noPassButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 2,
    },
    buttonSubtext: {
      color: '#FFFFFF',
      fontSize: 12,
      opacity: 0.95,
    },
    remaining: {
      marginTop: 20,
      color: isDark ? '#AEB3BD' : '#666',
      fontSize: 16,
      fontWeight: '500',
    },
  });
};
