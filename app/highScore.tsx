import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HighScoresScreen() {

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
      <Text> V3 Coming Soon </Text>

      <Pressable onPress={goBack}>
        <Text>Go Back</Text>
      </Pressable>
    </View>
  );
}
