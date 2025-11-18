/* app/play.tsx
   3×3 Grid TSA Game - Shows 9 items, tap logic, prevents double-tapping
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
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { easyItems, mediumItems, hardItems, GameItem } from '../lib/game/items';

type TappedItem = {
  item: GameItem;
  tapped: boolean;
};

export default function PlayScreen() {
  const colorScheme = useColorScheme() || 'light';

  // Game state
  const [score, setScore] = useState<number>(0);
  const [gameItems, setGameItems] = useState<TappedItem[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(60); // 60 second timer

  // Get 9 items from the difficulty lists (3 from each for variety)
  const selectedItems: GameItem[] = useMemo(() => {
    const items: GameItem[] = [];
    
    // Get 3 items from each difficulty level
    items.push(...easyItems.slice(0, 3));
    items.push(...mediumItems.slice(0, 3)); 
    items.push(...hardItems.slice(0, 3));
    
    // Shuffle the array to randomize positions
    return items.sort(() => Math.random() - 0.5);
  }, []);

  // Initialize game items with tapped status
  useEffect(() => {
    const initialItems: TappedItem[] = selectedItems.map(item => ({
      item,
      tapped: false,
    }));
    setGameItems(initialItems);
  }, [selectedItems]);

  // Timer countdown effect
  useEffect(() => {
    if (gameEnded || timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameEnded(true);
          // Time's up - go to score screen
          router.replace({ pathname: '/score', params: { score } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameEnded, timeRemaining, score]);

  // Handle item tap
  function handleItemTap(index: number) {
    if (gameEnded || gameItems[index].tapped) {
      return; // Prevent double-tapping or tapping after game ends
    }

    // Haptic feedback
    if (Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const tappedItem = gameItems[index].item;
    
    // Update the tapped state
    setGameItems(prev => 
      prev.map((gameItem, i) => 
        i === index ? { ...gameItem, tapped: true } : gameItem
      )
    );

    // Update score: +1 for prohibited items, -1 for safe items
    const pointValue = tappedItem.isProhibited ? 1 : -1;
    setScore(prevScore => prevScore + pointValue);

    // Check if all prohibited items have been tapped
    const updatedGameItems = gameItems.map((gameItem, i) => 
      i === index ? { ...gameItem, tapped: true } : gameItem
    );
    
    const allProhibitedTapped = updatedGameItems.every(gameItem => 
      !gameItem.item.isProhibited || gameItem.tapped
    );

    if (allProhibitedTapped) {
      // End the round automatically
      setTimeout(() => {
        const finalScore = score + pointValue;
        setGameEnded(true);
        router.replace({ pathname: '/score', params: { score: finalScore } });
      }, 500); // Small delay to show the final tap
    }
  }

  // Get the style for each grid item based on its state
  function getItemStyle(gameItem: TappedItem) {
    if (!gameItem.tapped) {
      return styles.gridItem;
    }
    
    // Different styles for tapped items based on whether they were prohibited or safe
    return gameItem.item.isProhibited 
      ? [styles.gridItem, styles.prohibitedTapped]
      : [styles.gridItem, styles.safeTapped];
  }

  return (
    <View style={styles.container}>
      {/* Header with Score and Timer */}
      <View style={styles.header}>
        <View style={styles.gameInfo}>
          <Text style={styles.headerText}>🎯 Score: {score}</Text>
          <Text style={styles.timerText}>⏱️ {timeRemaining}s</Text>
        </View>
        <Text style={styles.instructionHeader}>Tap all prohibited items!</Text>
      </View>

      {/* 3×3 Grid */}
      <View style={styles.grid}>
        {gameItems.map((gameItem, index) => (
          <Pressable
            key={gameItem.item.id}
            style={({ pressed }) => [
              getItemStyle(gameItem),
              pressed && !gameItem.tapped && styles.gridItemPressed,
            ]}
            onPress={() => handleItemTap(index)}
            disabled={gameItem.tapped || gameEnded}
          >
            <Image 
              source={gameItem.item.image} 
              style={styles.itemImage}
              resizeMode="cover"
            />
            <Text style={styles.itemName}>{gameItem.item.name}</Text>
            
            {/* Show feedback for tapped items */}
            {gameItem.tapped && (
              <View style={styles.feedbackOverlay}>
                <Text style={styles.feedbackText}>
                  {gameItem.item.isProhibited ? '+1' : '-1'}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          🔴 Tap prohibited items for +1 point
        </Text>
        <Text style={styles.instructionText}>
          🟢 Avoid safe items (-1 point)
        </Text>
        <Text style={styles.instructionText}>
          Game ends when all prohibited items are found!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingTop: 25,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  instructionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    height: '70%', // Use most of available screen height
    marginBottom: 15,
  },
  gridItem: {
    width: '30%', 
    height: '30%', // Make items take up 30% of grid height each
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  gridItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  prohibitedTapped: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  safeTapped: {
    backgroundColor: '#ffeaea',
    borderColor: '#f44336',
    borderWidth: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 14,
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  feedbackText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
  },
});
