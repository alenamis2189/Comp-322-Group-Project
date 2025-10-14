/* this window is for the actual screen of the game itself */
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, Pressable, StyleSheet, Image } from 'react-native';

export default function PlayScreen(){

    // /* setting up the amount of time per round */
    const [secondsRemaining, setSecondsRemaining] = useState(60);

    // game state: list of items, current index, and score
    type Item = { 
        id: string; 
        text: string; 
        correct: boolean; 
        imageUrl?: string; // Optional: for web URLs
        imagePath?: any;   // Optional: for local require() paths
    };
    
    const items: Item[] = useMemo(() => [
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
    

    // handle security decision on the current item
    function handleDecision(decision: 'pass' | 'no-pass'){
        // Logic: 
        // - "pass" means allow through (correct for safe items, incorrect for prohibited items)
        // - "no-pass" means confiscate (correct for prohibited items, incorrect for safe items)
        const isCorrectDecision = (decision === 'pass' && !currentItem.correct) || (decision === 'no-pass' && currentItem.correct);
        
        setScore((s: number) => s + (isCorrectDecision ? 1 : -1));

        // move to next item
        setCurrentIndex((i: number) => {
            const next = i + 1;
            if (next >= items.length){
                // calculate final score to pass to score screen
                const final = (isCorrectDecision ? score + 1 : score - 1);
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
                    {/* Item Display Card - Non-interactive */}
                    <View style={styles.itemDisplayCard}>
                        {/* Item Image */}
                        {currentItem.imageUrl && (
                            <Image 
                                source={{ uri: currentItem.imageUrl }} 
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                        )}
                        {/* Fallback: Local image using require */}
                        {currentItem.imagePath && !currentItem.imageUrl && (
                            <Image 
                                source={currentItem.imagePath} 
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                        )}
                        
                        <Text style={styles.itemText}>{currentItem.text}</Text>
                        <Text style={styles.instruction}>Security Decision Required</Text>
                    </View>

                    {/* Pass/No Pass Buttons */}
                    <View style={styles.buttonContainer}>
                        <Pressable 
                            onPress={() => handleDecision('pass')} 
                            style={({ pressed }) => [styles.decisionButton, styles.passButton, pressed && styles.buttonPressed]}
                        >
                            <Text style={styles.passButtonText}>✅ PASS</Text>
                            <Text style={styles.buttonSubtext}>Allow through</Text>
                        </Pressable>

                        <Pressable 
                            onPress={() => handleDecision('no-pass')} 
                            style={({ pressed }) => [styles.decisionButton, styles.noPassButton, pressed && styles.buttonPressed]}
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
    itemImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginBottom: 15,
    },
    itemDisplayCard: {
        backgroundColor: '#F0F0F0',
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
    itemText: { 
        fontSize: 28,
        fontWeight: '700',
        color: '#007AFF',
        marginBottom: 10, 
        textAlign: 'center',
    },
    instruction: {
        color: '#666666',
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
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
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
        opacity: 0.9,
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
