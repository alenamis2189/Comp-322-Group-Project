import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

export default function ScoreScreen(){
    // read numeric score from params (expo-router gives strings sometimes)
    const params = useLocalSearchParams() as { score?: string | number } | undefined;
    const score = params && params.score ? Number(params.score) : 0;

    // go back to play screen
    function playAgain(){
        router.replace('/playScreen');
    }

    function backtoIndex(){
        router.replace('/');
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Final Score</Text>
            <Text style={styles.score}>{score}</Text>

            <Pressable style={styles.button} onPress={playAgain}>
                <Text style={styles.buttonText}>Play Again</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={backtoIndex}>
                <Text style={styles.buttonText}>Back to Start</Text>
            </Pressable>

        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex:1, alignItems:'center', justifyContent: 'center', padding: 16 },
    title: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
    score: { fontSize: 48, fontWeight: '800', marginBottom: 16 },
    button: { backgroundColor: '#1976D2', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: '700' }
});
