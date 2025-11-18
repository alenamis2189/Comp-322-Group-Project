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
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  useColorScheme,
  Animated,
  Easing,
  LayoutAnimation,
  UIManager,
  Platform,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { easyItems, mediumItems, hardItems, GameItem } from '../lib/game/items';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TappedItem = {
  item: GameItem;
  tapped: boolean;
  scale: Animated.Value;
  overlayOpacity: Animated.Value;
};

const INITIAL_TIME = 60;

export default function PlayScreen() {
  const params = useLocalSearchParams() as { difficulty?: string } | undefined;
  const difficultyParam = (params && params.difficulty) ? String(params.difficulty) : 'Normal';

  const colorScheme = useColorScheme() || 'light';
  const isDark = colorScheme === 'dark';

  // Theme tokens
  const colors = {
    background: isDark ? '#06060a' : '#f5f5f5',
    card: isDark ? '#0f1115' : '#fff',
    primary: isDark ? '#7AA8FF' : '#007AFF',
    text: isDark ? '#E6E7EA' : '#222',
    subtext: isDark ? '#AEB3BD' : '#666',
    passBorder: '#4CAF50',
    failBorder: '#F44336',
    infoBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
  };

  // Game state
  const [score, setScore] = useState<number>(0);
  const [gameItems, setGameItems] = useState<TappedItem[]>([]);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(INITIAL_TIME);
  const [roundCount, setRoundCount] = useState<number>(0); // increments when a prohibited item is found

  // Animated progress bar value
  const progressAnim = useRef(new Animated.Value(1)).current;

  // Grid tile sizing
  const screenWidth = Dimensions.get('window').width;
  const gridPadding = 10 * 2; // container padding left+right
  const gridGap = 10; // gap between tiles
  const tileSize = Math.floor((screenWidth - gridPadding - gridGap * 2) / 3);

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
    setTimeRemaining(INITIAL_TIME);
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
      toValue: timeRemaining / INITIAL_TIME,
      duration: 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setGameEnded(true);
          router.replace({ pathname: '/score', params: { score } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEnded]); // only depends on gameEnded

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

  // Handle item tap
  function handleItemTap(index: number) {
    if (gameEnded) return;
    // Defensive: if item already tapped, ignore
    const current = gameItems[index];
    if (!current || current.tapped) return;

    // compute new score synchronously
    const pointValue = current.item.isProhibited ? 1 : -1;
    const newScore = score + pointValue;
    setScore(newScore);

    // mark tapped
    setGameItems((prev) => prev.map((g, i) => (i === index ? { ...g, tapped: true } : g)));

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

    if (allProhibitedTapped) {
      // small delay so animations finish, then end round and navigate
      setTimeout(() => {
        animateLayoutNext();
        setGameEnded(true);
        router.replace({ pathname: '/score', params: { score: newScore } });
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
          { width: tileSize, aspectRatio: 1 },
        ]}
      >
        <Pressable
          onPressIn={() => doHaptic()}
          onPress={() => handleItemTap(idx)}
          disabled={t.tapped || gameEnded}
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

        <View style={styles.infoRight}>
          <Text style={[styles.infoLabel, { color: colors.subtext }]}>⚙️</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{difficultyParam}</Text>
        </View>
      </View>

      {/* Progress bar under info bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBarFill, { width: progressWidth, backgroundColor: colors.primary }]} />
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {gameItems.map((g, i) => renderTile(g, i))}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 25 },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 12,
    marginBottom: 6,
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 16, fontWeight: '700' },

  progressBarContainer: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: { height: '100%', borderRadius: 6 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    gap: 10,
    marginBottom: 12,
    alignSelf: 'center',
  },
  gridItem: {
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    marginBottom: 10,
  },
  pressableInner: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  gridItemPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  itemImage: { width: 60, height: 60, borderRadius: 8, marginBottom: 6 },
  itemName: { fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 14 },

  feedbackOverlay: { position: 'absolute', top: 6, right: 6, borderRadius: 10, padding: 6, minWidth: 34, alignItems: 'center', justifyContent: 'center' },
  feedbackText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  instructions: { padding: 12, borderRadius: 12, marginTop: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  instructionText: { fontSize: 15, textAlign: 'center', marginBottom: 6 },
});

