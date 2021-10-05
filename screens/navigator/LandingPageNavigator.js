import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setIsDarkMode } from '../../store/data/function';
import { useDispatch } from 'react-redux'

// Sreens
import HomePageNavigator from '../navigator/HomePageNavigator';
import Intro from '../landingPage/Intro';
import Register from '../landingPage/Register';
import Splash from '../landingPage/Splash';

export default function LandingPageNavigator() {
    const Stack = createNativeStackNavigator();
    const darkMode = useColorScheme();
    const dispatch = useDispatch()
  
    useEffect(() => {
        dispatch(setIsDarkMode(darkMode === 'dark'))
    }, [darkMode])

    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Intro" component={Intro} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="HomePageNavigator" component={HomePageNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
    )
}
