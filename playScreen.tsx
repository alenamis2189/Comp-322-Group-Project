/* this window is for the actual screen of the game itself */
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function PlayScreen(){

    /* setting up the amount of time per round */
    const [secondsRemaining, setSecondsRemaining] = useState(60);

    // start the timer when the screen first appears
    useEffect(() => {
        let timer = setInterval(()=> {
            setSecondsRemaining((secondsRemaining) =>{
                if (secondsRemaining <=1){
                    clearInterval(timer);
                    // goes to the score screen after it's done
                    router.replace('/scoreScreen');
                    return 0;
                }
                else {
                    return secondsRemaining -1;
                }
            });
        }, 1000);

        // run this code every second (1000 ms)
        return () => clearInterval(timer);
        }, []);
    

    return (
        <View style={{ flex:1, alignItems:'center', justifyContent: 'center'}}>
            <Text> Time left: {secondsRemaining} </Text>
            <Text> play screen </Text>
        </View>
    );
}
