/* this window is for the actual screen of the game itself */
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

export default function PlayScreen(){

    // /* setting up the amount of time per round */
    const [secondsRemaining, setSecondsRemaining] = useState(60);

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
                    // Corrected to use '/score' path
                    router.replace({ pathname: '/score', params: { score } });
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
                // Corrected to use '/score' path
                router.replace({ pathname: '/score', params: { score: final } });
                return i; // keep as-is while navigating
            }
            return next;
        });
    }

    const currentItem = items[currentIndex];

    return (
        <View style={styles.container}>
            {/* Header for Timer and Score - Placed at the top */}
            <View style={styles.header}>
                <Text style={styles.headerText}>🕒 Time: {secondsRemaining}</Text>
                <Text style={styles.headerText}>🏆 Score: {score}</Text>
            </View>

            {/* Main Content Card */}
            {currentItem ? (
                <View style={styles.cardContainer}>
                    <Pressable 
                        onPress={() => handleTap(currentItem.correct)} 
                        // Feedback on press: changing opacity
                        style={({ pressed }) => [styles.itemPressable, pressed && styles.itemPressablePressed]} 
                    >
                        <Text style={styles.itemText}> 🧳 {currentItem.text} </Text>
                        <Text style={styles.tapPrompt}>Tap to check the item</Text>
                    </Pressable>

                    <Text style={styles.remaining}>Items Left: {items.length - currentIndex - 1}</Text>
                </View>
            ) : (
                <Text style={styles.itemText}>Processing Results...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FFFFFF',
        paddingTop: 50, // Space from the top edge
        paddingHorizontal: 20, 
    },
    // Header for Timer and Score
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },
    // Item Card
    cardContainer: { 
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%', 
        maxWidth: 500,
        alignSelf: 'center',
    },
    itemPressable: {
        backgroundColor: '#F0F0F0', // Subtle card background
        padding: 40,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 5,
    },
    itemPressablePressed: {
        opacity: 0.9, // Feedback on press
    },
    itemText: { 
        fontSize: 36,
        fontWeight: '700',
        color: '#007AFF', // Item text in primary color
        marginBottom: 10, 
        textAlign: 'center',
    },
    tapPrompt: {
        color: '#666666',
        fontSize: 16,
    },
    remaining: { 
        marginTop: 20, 
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    }
});
