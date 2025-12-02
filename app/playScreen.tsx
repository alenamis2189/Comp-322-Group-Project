/* app/play.tsx
   3×3 Grid TSA Game - Shows 9 items, tap logic, prevents double-tapping
   Updated:
   - Info bar: Time, Score, Round, Difficulty
   - Difficulty read from router params
   - Round increments when a prohibited item is found
   - Progress bar timer
   - Per-tile press animations + haptics (onPressIn)
   - Light/dark theming tokens
   - Timer starts once on mount
*/
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Image,
    LayoutAnimation,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    UIManager,
    useColorScheme,
    View,
} from 'react-native';
import { easyItems, GameItem, hardItems, mediumItems } from '../lib/game/items';
import { getTimerForDifficulty, calculateStreakBonus, calculateReactionBonus } from '../lib/game/rules'; // -fg

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TappedItem = {
  item: GameItem;
  tapped: boolean;
  scale: Animated.Value;
  overlayOpacity: Animated.Value;
  tapTime?: number; // Reaction time tracking
};

type GameStats = {
  totalTaps: number;
  correctTaps: number;
  incorrectTaps: number;
  currentStreak: number;
  maxStreak: number;
  averageReactionTime: number;
  reactionTimes: number[];
};

const INITIAL_TIME = 60;

export default function PlayScreen() {
  const params = useLocalSearchParams();

  // read difficulty & multi-round info from route params -fg
  const difficultyParam = params.difficulty ? String(params.difficulty) : 'easy'; // default to easy if missing 
  const gameRound = params.gameRound ? Number(params.gameRound) : 1; // numeric round index 
  const gameTotalRounds = params.gameTotalRounds ? Number(params.gameTotalRounds) : 1; // total rounds 
  const totalScore = params.totalScore ? Number(params.totalScore) : 0; // total score before this round 

  const normalizedDifficulty = difficultyParam.toLowerCase() as 'easy' | 'medium' | 'hard'; // -fg
  const timerSeconds = getTimerForDifficulty(normalizedDifficulty); // -fg

  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  // Theme tokens - Force light theme for better gameplay visibility
  const colors = {
    background: '#f5f5f5', // Always use light background for better item visibility
    card: isDark ? '#fff' : '#fff', // Always white cards
    primary: isDark ? '#007AFF' : '#007AFF', // Consistent primary color
    text: isDark ? '#222' : '#222', // Dark text for readability
    subtext: isDark ? '#666' : '#666', // Consistent subtext
    passBorder: '#4CAF50',
    failBorder: '#F44336',
    infoBg: 'rgba(0,0,0,0.03)', // Light info background
  };

  // Game state
  const [score, setScore] = useState<number>(0);
  const [gameItems, setGameItems] = useState<TappedItem[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(INITIAL_TIME);
  const [roundCount, setRoundCount] = useState<number>(0); // increments when a prohibited item is found
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  
  // Enhanced stats tracking
  const [gameStats, setGameStats] = useState<GameStats>({
    totalTaps: 0,
    correctTaps: 0,
    incorrectTaps: 0,
    currentStreak: 0,
    maxStreak: 0,
    averageReactionTime: 0,
    reactionTimes: [],
  });

  // Animated progress bar value
  const progressAnim = useRef(new Animated.Value(1)).current;

  // No need for tileSize calculation - using percentage-based grid

  // Choose composition based on difficulty param
  // Minimal, deterministic composition:
  // Easy  -> more safe items; Hard -> more prohibited items
  const composition = useMemo(() => {
    const diff = difficultyParam?.toLowerCase();
    if (diff === 'easy') return { easy: 5, medium: 3, hard: 1 };
    if (diff === 'hard') return { easy: 1, medium: 3, hard: 5 };
    // Normal or unknown
    return { easy: 3, medium: 3, hard: 3 };
  }, [difficultyParam]);

  // Prepare selected 9 items according to composition and shuffle
  const selectedItems: GameItem[] = useMemo(() => {
    const items: GameItem[] = [];
    items.push(...easyItems.slice(0, composition.easy));
    items.push(...mediumItems.slice(0, composition.medium));
    items.push(...hardItems.slice(0, composition.hard));
    // If composition sums not equal to 9 (defensive), trim/expand
    if (items.length > 9) return items.slice(0, 9).sort(() => Math.random() - 0.5);
    if (items.length < 9) {
      // fill from easyItems if needed
      const pool = [...easyItems, ...mediumItems, ...hardItems];
      let i = 0;
      while (items.length < 9 && i < pool.length) {
        if (!items.find((it) => it.id === pool[i].id)) items.push(pool[i]);
        i++;
      }
    }
    return items.sort(() => Math.random() - 0.5);
  }, [composition]);

  // total number of prohibited items in the grid (used to show round progress)
  const totalProhibited = useMemo(
    () => selectedItems.filter((s) => s.isProhibited).length || 1,
    [selectedItems]
  );

  // Initialize game items with animated values on mount or when selectedItems change
  useEffect(() => {
    const initial: TappedItem[] = selectedItems.map((item) => ({
      item,
      tapped: false,
      scale: new Animated.Value(1),
      overlayOpacity: new Animated.Value(0),
    }));
    setGameItems(initial);
    setScore(0);
    setGameEnded(false);
    setRoundCount(0);
    setTimeRemaining(timerSeconds); // -fg
    setGameStartTime(Date.now());
    setGameStats({
      totalTaps: 0,
      correctTaps: 0,
      incorrectTaps: 0,
      currentStreak: 0,
      maxStreak: 0,
      averageReactionTime: 0,
      reactionTimes: [],
    });
    progressAnim.setValue(1);
    // animate progress to full instantly to ensure consistent starting state
    Animated.timing(progressAnim, { toValue: 1, duration: 0, useNativeDriver: false }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  // Start timer once when mounted (not restarting on every tick)
  useEffect(() => {
    if (gameEnded) return;

    // Animate the progress bar whenever timeRemaining changes (also triggered here)
    Animated.timing(progressAnim, {
      toValue: timeRemaining / timerSeconds, // -fg
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      // Only decrement timer if game is not paused
      if (!isPaused) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEnded, isPaused]); // now depends on gameEnded and isPaused

  // when time runs out, end the round and go to score screen -fg
  useEffect(() => {
    if (timeRemaining !== 0 || gameEnded) {
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setGameEnded(true);

    router.replace({
      pathname: '/scoreScreen',
      params: {
        roundScore: String(score),                // this round's score -fg
        totalScore: String(totalScore + score),   // cumulative score -fg
        difficulty: normalizedDifficulty,
        gameRound: String(gameRound),
        gameTotalRounds: String(gameTotalRounds),
        // Enhanced stats
        accuracy: String(Math.round((gameStats.correctTaps / Math.max(gameStats.totalTaps, 1)) * 100)),
        maxStreak: String(gameStats.maxStreak),
        averageReactionTime: String(Math.round(gameStats.averageReactionTime)),
        totalTaps: String(gameStats.totalTaps),
        correctTaps: String(gameStats.correctTaps),
      },
    });
  }, [timeRemaining, gameEnded, score, totalScore, normalizedDifficulty, gameRound, gameTotalRounds]);

  // Layout animation helper on round end
  function animateLayoutNext() {
    LayoutAnimation.configureNext({
      duration: 280,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
  }

  // Haptic helper (called onPressIn)
  async function doHaptic() {
    try {
      await Haptics.selectionAsync();
    } catch {
      // ignore
    }
  }

  // Handle item tap with enhanced scoring
  function handleItemTap(index: number) {
    if (gameEnded || isPaused) return; // Prevent taps when game is paused
    // Defensive: if item already tapped, ignore
    const current = gameItems[index];
    if (!current || current.tapped) return;

    const tapTime = Date.now();
    const reactionTime = tapTime - gameStartTime;
    
    // Determine if tap was correct (tapping prohibited items is correct)
    const isCorrect = current.item.isProhibited;
    
    // Calculate base score
    const basePoints = isCorrect ? 1 : -1;
    
    // Update stats
    const newStats: GameStats = {
      ...gameStats,
      totalTaps: gameStats.totalTaps + 1,
      correctTaps: gameStats.correctTaps + (isCorrect ? 1 : 0),
      incorrectTaps: gameStats.incorrectTaps + (isCorrect ? 0 : 1),
      currentStreak: isCorrect ? gameStats.currentStreak + 1 : 0,
      maxStreak: isCorrect ? Math.max(gameStats.maxStreak, gameStats.currentStreak + 1) : gameStats.maxStreak,
      reactionTimes: [...gameStats.reactionTimes, reactionTime],
      averageReactionTime: 0, // Will calculate below
    };
    
    // Calculate average reaction time
    newStats.averageReactionTime = newStats.reactionTimes.reduce((a, b) => a + b, 0) / newStats.reactionTimes.length;
    
    // Calculate bonuses
    const streakBonus = calculateStreakBonus(newStats.currentStreak);
    const reactionBonus = isCorrect ? calculateReactionBonus(reactionTime) : 0;
    
    // Final score calculation
    const totalPoints = basePoints + streakBonus + reactionBonus;
    const newScore = Math.max(0, score + totalPoints); // Prevent negative scores
    
    setScore(newScore);
    setGameStats(newStats);

    // mark tapped with reaction time
    setGameItems((prev) => prev.map((g, i) => (i === index ? { ...g, tapped: true, tapTime: reactionTime } : g)));

    // run tile animations: pulse + overlay
    Animated.parallel([
      Animated.sequence([
        Animated.timing(current.scale, { toValue: 0.94, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(current.scale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(current.overlayOpacity, { toValue: 0.95, duration: 120, easing: Easing.out(Easing.linear), useNativeDriver: false }),
        Animated.timing(current.overlayOpacity, { toValue: 0, duration: 320, easing: Easing.linear, useNativeDriver: false }),
      ]),
    ]).start();

    // increment round if it's a prohibited item (A1)
    if (current.item.isProhibited) {
      setRoundCount((r) => r + 1);
    }

    // Check if all prohibited items were tapped; create updated view first
    const updated = gameItems.map((g, i) => (i === index ? { ...g, tapped: true } : g));
    const allProhibitedTapped = updated.every((g) => !g.item.isProhibited || g.tapped);

    if (allProhibitedTapped && !gameEnded) {
      // small delay so animations finish, then end round and navigate
      setTimeout(() => {
        animateLayoutNext();
        setGameEnded(true);
        router.replace({
          pathname: '/scoreScreen',
          params: {
            roundScore: String(newScore), // -fg
            totalScore: String(totalScore + newScore), // -fg
            difficulty: normalizedDifficulty,
            gameRound: String(gameRound), // keep the same round index for ScoreScreen -fg
            gameTotalRounds: String(gameTotalRounds), // -fg
            // Enhanced stats
            accuracy: String(Math.round((newStats.correctTaps / Math.max(newStats.totalTaps, 1)) * 100)),
            maxStreak: String(newStats.maxStreak),
            averageReactionTime: String(Math.round(newStats.averageReactionTime)),
            totalTaps: String(newStats.totalTaps),
            correctTaps: String(newStats.correctTaps),
          },
        });
      }, 520);
    }
  }

  // Render a single tile (Animated)
  function renderTile(t: TappedItem, idx: number) {
    const borderStyle = t.tapped
      ? t.item.isProhibited
        ? { borderColor: colors.passBorder, borderWidth: 3, backgroundColor: isDark ? '#0d2110' : '#e8f5e8' }
        : { borderColor: colors.failBorder, borderWidth: 3, backgroundColor: isDark ? '#2a0b0b' : '#ffeaea' }
      : { backgroundColor: colors.card };

    const animatedStyle = { transform: [{ scale: t.scale }] };

    return (
      <Animated.View
        key={t.item.id}
        style={[
          styles.gridItem,
          borderStyle,
          animatedStyle,
          // Remove tileSize override to let CSS grid work
        ]}
      >
        <Pressable
          onPressIn={() => doHaptic()}
          onPress={() => handleItemTap(idx)}
          disabled={t.tapped || gameEnded || isPaused} // Disable when paused
          style={({ pressed }) => [
            styles.pressableInner,
            pressed && !t.tapped && styles.gridItemPressed,
          ]}
        >
          <Image source={t.item.image} style={styles.itemImage} resizeMode="cover" />
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
            {t.item.name}
          </Text>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.feedbackOverlay,
              {
                opacity: t.overlayOpacity,
                backgroundColor: t.item.isProhibited ? 'rgba(76,175,80,0.92)' : 'rgba(244,67,54,0.92)',
              },
            ]}
          >
            <Text style={styles.feedbackText}>{t.item.isProhibited ? '+1' : '-1'}</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Section - Info and Progress */}
      <View style={{ flex: 0 }}>
        {/* Info bar: Score | Time | Round | Difficulty */}
        <View style={[styles.infoBar, { backgroundColor: colors.infoBg }]}>
          <View style={styles.infoLeft}>
            <Text style={[styles.infoLabel, { color: colors.subtext }]}>⏱</Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>{timeRemaining}s</Text>
          </View>

          <View style={styles.infoCenter}>
            <Text style={[styles.infoLabel, { color: colors.subtext }]}>🏆</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{score}</Text>
          </View>

          <View style={styles.infoCenter}>
            <Text style={[styles.infoLabel, { color: colors.subtext }]}>🔁</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {roundCount}/{totalProhibited}
            </Text>
          </View>

          <View style={styles.infoCenter}>
            <Text style={[styles.infoLabel, { color: colors.subtext }]}>⚙️</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{difficultyParam}</Text>
          </View>
        </View>

        {/* Progress bar under info bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth, backgroundColor: colors.primary }]} />
        </View>
      </View>

      {/* Middle Section - Grid (constrained) */}
      <View style={{ flex: 0.65, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.grid}>
          {gameItems.map((g, i) => renderTile(g, i))}
        </View>
      </View>

      {/* Bottom Section - Stats and Instructions */}
      <View style={{ flex: 0.25, justifyContent: 'flex-start' }}>
        {/* Enhanced Stats Display */}
        <View style={[styles.statsBar, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Accuracy</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {gameStats.totalTaps > 0 ? Math.round((gameStats.correctTaps / gameStats.totalTaps) * 100) : 0}%
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Streak</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {gameStats.currentStreak} (Max: {gameStats.maxStreak})
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Avg Time</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {gameStats.reactionTimes.length > 0 ? Math.round(gameStats.averageReactionTime) : 0}ms
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={[styles.instructions, { backgroundColor: colors.card }]}>
          <Text style={[styles.instructionText, { color: colors.subtext }]}>🔴 Tap prohibited items for +1 point</Text>
          <Text style={[styles.instructionText, { color: colors.subtext }]}>🟢 Avoid safe items (-1 point)</Text>
          <Text style={[styles.instructionText, { color: colors.subtext }]}>
            Each time you find a prohibited item it's counted as a round.
          </Text>
        </View>
      </View>

      {/* Floating Pause Button - Positioned absolutely */}
      <Pressable 
        style={styles.floatingPauseButton}
        onPress={() => {
          console.log("Floating pause button tapped!"); 
          setIsPaused(true);
        }}
      >
        <Text style={styles.floatingPauseText}>⏸️</Text>
      </Pressable>

      {/* Pause Modal */}
      <Modal
        visible={isPaused}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPaused(false)}
      >
        <View style={styles.pauseModalOverlay}>
          <View style={[styles.pauseModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.pauseModalTitle, { color: colors.text }]}>Game Paused</Text>
            
            <View style={styles.pauseModalButtons}>
              <Pressable 
                style={[styles.pauseModalButton, styles.resumeButton]}
                onPress={() => setIsPaused(false)}
              >
                <Text style={styles.resumeButtonText}>▶️ Resume</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.pauseModalButton, styles.exitButton]}
                onPress={() => {
                  setIsPaused(false);
                  router.replace('/');
                }}
              >
                <Text style={styles.exitButtonText}>🚪 Exit Game</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 8, 
    paddingTop: 15,
    paddingBottom: 20, // Ensure bottom padding for visibility
    // Remove justifyContent to allow natural spacing
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8, 
    borderRadius: 10,
    marginBottom: 4,
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 16, fontWeight: '700' },

  // Working pause button styles
  topButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  workingPauseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  workingPauseText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Floating pause button - absolutely positioned
  floatingPauseButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingPauseText: {
    color: '#fff',
    fontSize: 24,
  },

  // Simple pause button for debugging
  simplePauseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
    zIndex: 999, // Ensure it's on top
  },
  simplePauseText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Debug pause button - positioned at very top
  debugPauseButton: {
    backgroundColor: '#FF3B30',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 999,
    zIndex: 9999,
  },
  debugPauseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  progressBarContainer: {
    height: 4, // Thinner progress bar
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6, // Reduced margin
  },
  progressBarFill: { height: '100%', borderRadius: 6 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Better distribution
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: '100%', // Full width for maximum size
    maxWidth: 450, // Much larger max width
    marginBottom: 8, // Reduced margin for more space
    paddingHorizontal: 8, // Reduced padding for more space
    // Remove fixed height constraints to let it grow naturally
  },
  gridItem: {
    width: '30%', // Standard 30% for 3 columns
    aspectRatio: 1, // Square items - let them be as big as possible
    borderRadius: 16, // Larger border radius for bigger squares
    padding: 18, // More generous padding
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    marginBottom: 8, // Reduced margin for tighter layout
    backgroundColor: '#fff',
  },
  pressableInner: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  gridItemPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  itemImage: { width: 85, height: 85, borderRadius: 12, marginBottom: 10 },
  itemName: { fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 16 },

  feedbackOverlay: { position: 'absolute', top: 6, right: 6, borderRadius: 10, padding: 6, minWidth: 34, alignItems: 'center', justifyContent: 'center' },
  feedbackText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8, // Reduced padding
    borderRadius: 10,
    marginBottom: 6, // Reduced margin
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 10, fontWeight: '600', marginBottom: 1 },
  statValue: { fontSize: 12, fontWeight: '700' },

  instructions: { 
    padding: 8, // Reduced padding
    borderRadius: 10, 
    marginTop: 4, // Reduced margin
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 3, 
    elevation: 2,
    flex: 0, // Don't expand
  },
  instructionText: { fontSize: 13, textAlign: 'center', marginBottom: 3 },

  // Pause button styles
  pauseButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    minWidth: 44, // Minimum touch target size
    minHeight: 44,
    backgroundColor: 'rgba(0,122,255,0.1)', // Light background for better visibility
  },
  pauseButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  pauseButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },

  // Pause modal styles
  pauseModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseModal: {
    width: '80%',
    maxWidth: 300,
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pauseModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  pauseModalButtons: {
    gap: 15,
  },
  pauseModalButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  resumeButton: {
    backgroundColor: '#007AFF',
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  exitButton: {
    backgroundColor: '#FF3B30',
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
