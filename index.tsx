import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HomeScreen() {

  function startTSAGame(){
    router.push('/playScreen');
  }
  return (

    /* Settings for the layout container, flex to expand to the whole screen */
    < View style = {{ 
      flex:1,
      justifyContent: 'center', 
      alignItems: 'center'}}>
        <Text> TSA Luggage Check </Text>
          <Pressable onPress = {startTSAGame}>
            <Text> Start the Game </Text>
          </Pressable>
    </View>
  );
};
