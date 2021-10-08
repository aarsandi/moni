import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Sreens
import Home from '../homeScreen/Home';
import FormSpend from '../homeScreen/FormSpend';

export default function HomeScreenNavigator() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }}  />
            <Stack.Screen name="FormSpend" component={FormSpend} options={{ title: ' ' }}  />
        </Stack.Navigator>
    )
}
