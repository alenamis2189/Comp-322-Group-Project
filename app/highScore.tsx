import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getHighScores, clearHighScores } from '../lib/game/highScores';

export default function HighScoresScreen() {
  const [scores, setScores] = React.useState([]);

    useEffect(() => {
            setScores(getHighScores());
    }, []);

    // simple button to go back to start -fg
    function goBack() {
        router.replace('/');
    }

    return (
            <View style={{
            flex: 1,
            justifyContent: 'center',
    alignItems: 'center'
    }}>
      <Text>High Scores</Text>
            {scores.length === 0 ? (
                    <Text>No scores yet.</Text>)
 : (
            scores.map((s, i) => (
                    <Text key={i}>
            {i + 1}. {s.score} pts — {s.difficulty.toUpperCase()}
    </Text>
  ))
)}

    <Pressable onPress={() => { clearHighScores(); setScores([]); }}>
      <Text>Clear Scores</Text>
            </Pressable>
            </View>
    );
}
