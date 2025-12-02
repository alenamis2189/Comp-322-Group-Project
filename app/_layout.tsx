import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#007AFF';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: headerBackgroundColor },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'TSA Security Training',
        }}
      />
      <Stack.Screen
        name="difficulty"
        options={{
          title: 'Select Difficulty',
        }}
      />
      <Stack.Screen
        name="playScreen"
        options={{
          title: 'Security Check',
          headerShown: false, // Hide header during gameplay for better immersion
        }}
      />
      <Stack.Screen
        name="scoreScreen"
        options={{
          title: 'Results',
          headerLeft: () => null, // Prevent going back during score display
        }}
      />
      <Stack.Screen
        name="highScore"
        options={{
          title: 'High Scores',
        }}
      />
      <Stack.Screen
        name="rules"
        options={{
          title: 'How to Play',
        }}
      />
    </Stack>
  );
}

