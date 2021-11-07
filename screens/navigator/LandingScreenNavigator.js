import React, { useEffect } from 'react'
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setIsDarkMode } from '../../store/app/function';
import { useDispatch } from 'react-redux'

// Sreens
import AppScreenNavigator from './AppScreenNavigator';
import Intro from '../landingScreen/Intro';
import Register from '../landingScreen/Register';
import Splash from '../landingScreen/Splash';
import { navigationRef } from '../../helpers/rootNavigation';

export default function LandingScreenNavigator() {
  const Stack = createNativeStackNavigator();
  const darkMode = useColorScheme();
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setIsDarkMode(darkMode === 'dark' ? '#000000':'#ffffff'))
  }, [darkMode])

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="AppScreenNavigator" component={AppScreenNavigator} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Intro" component={Intro} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
