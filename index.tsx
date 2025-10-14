iimport { router } from 'expo-router';
 import { Pressable, Text, View, StyleSheet } from 'react-native'; // Import StyleSheet

 export default function HomeScreen() {

   function startTSAGame(){
     // Use the correct path name: 'play' not 'playScreen' based on your _layout.tsx
     router.push('/play');
   }

   return (
     <View style={styles.container}>
       <Text style={styles.title}>TSA Luggage Check</Text>
       <Text style={styles.subtitle}>Test your security skills!</Text>

       {/* Start Button */}
       <Pressable
         onPress={startTSAGame}
         // Small tap feedback: change opacity when pressed
         style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
       >
         <Text style={styles.buttonText}>Start Game</Text>
       </Pressable>
     </View>
   );
 };

 // New StyleSheet for a clean look
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#FFFFFF', // Clean background
     padding: 30,
   },
   title: {
     fontSize: 32, // Large, clear title
     fontWeight: '800', // Extra bold
     color: '#333333',
     marginBottom: 10,
   },
   subtitle: {
     fontSize: 18,
     color: '#666666',
     marginBottom: 40, // Space before button
   },
   button: {
     backgroundColor: '#007AFF', // Primary Blue
     paddingVertical: 15,
     paddingHorizontal: 30,
     borderRadius: 10, // Rounded corners
     minWidth: 200, // Makes the button big enough
     alignItems: 'center',
     shadowColor: '#000', // Subtle shadow for depth
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.1,
     shadowRadius: 4,
     elevation: 3,
   },
   buttonPressed: {
     opacity: 0.85, // Feedback on press
   },
   buttonText: {
     color: '#FFFFFF',
     fontSize: 20,
     fontWeight: '700',
   },
 });
