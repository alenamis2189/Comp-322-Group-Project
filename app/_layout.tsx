import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';

// Setting up navitation as stack -fg
export default function Layout() {
  const colorScheme = useColorScheme();
  const ActiveTintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <Stack
      screenOptions={{
        headerStyle: {backgroundColor: ActiveTintColor},
        headerTintColor: '#fff',

      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Start',
        }}
      />
      <Stack.Screen
        name="difficulty"
        options={{
          title: 'Select Level of Difficulty',
        }}
      />
      <Stack.Screen
        name="playScreen"
        options={{
          title: 'Play',
        }}
      />
      <Stack.Screen
        name="scoreScreen"
        options={{
          title: 'Results',
        }}
      />
      <Stack.Screen
        name="highScores"
        options={{
          title: 'High Scores',
        }}
      />
    </Stack>
  );
}
