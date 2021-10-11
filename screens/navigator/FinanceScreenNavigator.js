import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Sreens
import Finance from '../financeScreen/Finance';

export default function FinanceScreenNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Finance" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Finance" component={Finance} options={{ title: 'Finance' }}  />
        </Stack.Navigator>
    )
}
