import React, { useEffect, useState } from 'react'
import { useColorScheme, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux'
import {setIsDarkMode} from '../../store/data/function';
import {fetchProfile} from '../../store/profile/function';

// Sreens
import HomePageNavigator from '../navigator/HomePageNavigator';
import Intro from '../landingPage/Intro';
import Register from '../landingPage/Register';

export default function LandingPageNavigator() {
    const Stack = createNativeStackNavigator();
    const darkMode = useColorScheme();
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const { rekTabungan, rekDompet, email } = useSelector((state) => state.profileReducer)
  
    useEffect(() => {
        dispatch(setIsDarkMode(darkMode === 'dark'))
    }, [darkMode])

    useEffect(() => {
        fetchProfile(dispatch, (el) => {
            setIsLoading(el)
        })
    }, [])

    if(isLoading) {
        return(
            <View>
                <Text>Loding...</Text>
            </View>
        )
    } else {
        return (
            <NavigationContainer>
              <Stack.Navigator initialRouteName={rekTabungan&&rekDompet&&email?"HomePageNavigator":"Intro"}screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Intro" component={Intro} />
                <Stack.Screen name="HomePageNavigator" component={HomePageNavigator} />
                <Stack.Screen name="Register" component={Register} />
              </Stack.Navigator>
            </NavigationContainer>
        )
    }
}
