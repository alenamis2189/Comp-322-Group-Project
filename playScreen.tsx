/* this window is for the actual screen of the game itself */
/* this window is for the actual screen of the game itself */
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

export default function PlayScreen(){

    // /* setting up the amount of time per round */
    const [secondsRemaining, setSecondsRemaining] = useState(60);
    // const [secondsRemaining, setSecondsRemaining] = useState(60);

    // // game state: list of items, current index and score
    // // For demo purposes we'll use a small list of strings. Replace with your real items.
    // type Item = { id: string; text: string; correct: boolean };
    // const items: Item[] = useMemo(() => [
    //     { id: 'a', text: 'Apple', correct: true },
    //     { id: 'b', text: 'Banana', correct: false },
    //     { id: 'c', text: 'Cherry', correct: true },
    //     { id: 'd', text: 'Date', correct: false },
    // ], []);

    // const [currentIndex, setCurrentIndex] = useState<number>(0);
    // const [score, setScore] = useState<number>(0);

    // game state: list of items, current index and score
    // For demo purposes we'll use a small list of strings. Replace with your real items.
    type Item = { id: string; text: string; correct: boolean };
    const items: Item[] = useMemo(() => [
         { id: 'a', text: 'Apple', correct: true },
         { id: 'b', text: 'Banana', correct: false },
         { id: 'c', text: 'Cherry', correct: true },
         { id: 'd', text: 'Date', correct: false },
    ], []);

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);

    // start the timer when the screen first appears
    useEffect(() => {
        let timer = setInterval(()=> {
            setSecondsRemaining((secondsRemaining: number) =>{
                if (secondsRemaining <=1){
                    clearInterval(timer);
                    // goes to the score screen after it's done
                    router.replace({ pathname: '/scoreScreen', params: { score } });
                    return 0;
                }
                else {
                    return secondsRemaining -1;
                }
            });
        }, 1000);

        // run this code every second (1000 ms)
        return () => clearInterval(timer);
    }, [score]);
    

    // handle a tap on the current item
    function handleTap(isCorrect: boolean){
        setScore((s: number) => s + (isCorrect ? 1 : -1));

        // move to next item
        setCurrentIndex((i: number) => {
            const next = i + 1;
            if (next >= items.length){
                // calculate final score to pass to score screen
                const final = (isCorrect ? score + 1 : score - 1);
                router.replace({ pathname: '/scoreScreen', params: { score: final } });
                return i; // keep as-is while navigating
            }
            return next;
        });
    }

    const currentItem = items[currentIndex];

    return (
        // <View style={{ flex:1, alignItems:'center', justifyContent: 'center'}}>
        //     <Text> Time left: {secondsRemaining} </Text>
        //     <Text> play screen </Text>
        <View style={styles.container}>
            <Text style={styles.timer}>Time left: {secondsRemaining}</Text>
            <Text style={styles.score}>Score: {score}</Text>

            {currentItem ? (
                <View style={styles.cardContainer}>
                    <Pressable onPress={() => handleTap(currentItem.correct)} style={(state: { pressed: boolean }) => [{ opacity: state.pressed ? 0.7 : 1, alignItems: 'center' }] }>
                        <Text style={styles.itemText}> {currentItem.text} </Text>
                        <Text style={{ color: '#666' }}>Tap the item</Text>
                    </Pressable>

                    <Text style={styles.remaining}>Remaining: {items.length - currentIndex - 1}</Text>
                </View>
            ) : (
                <Text>No items left</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex:1, alignItems: 'center', justifyContent: 'center', padding: 16 },
    timer: { fontSize: 18, marginBottom: 8 },
    score: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
    cardContainer: { width: '100%', maxWidth: 420, alignItems: 'center' },
    itemText: { fontSize: 28, marginBottom: 16 },
    buttonsRow: { flexDirection: 'row', gap: 12 },
    button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
    correct: { backgroundColor: '#4CAF50' },
    incorrect: { backgroundColor: '#F44336' },
    buttonText: { color: '#fff', fontWeight: '700' },
    remaining: { marginTop: 12, color: '#666' }
});
