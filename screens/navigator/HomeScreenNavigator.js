import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Sreens
import Home from '../homeScreen/Home';
import FormSpend from '../homeScreen/FormSpend';
import FormAmbilCash from '../homeScreen/FormAmbilCash';
import FormInputPenghasilan from '../homeScreen/FormInputPenghasilan';
import FormLoan from '../homeScreen/FormLoan';
import FormNabung from '../homeScreen/FormNabung';
import FormBayarHutang from '../homeScreen/FormBayarHutang';

export default function HomeScreenNavigator() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }}  />
            <Stack.Screen name="FormSpend" component={FormSpend} options={{ title: ' ' }}  />
            <Stack.Screen name="FormAmbilCash" component={FormAmbilCash} options={{ title: ' ' }}  />
            <Stack.Screen name="FormInputPenghasilan" component={FormInputPenghasilan} options={{ title: ' ' }}  />
            <Stack.Screen name="FormLoan" component={FormLoan} options={{ title: ' ' }}  />
            <Stack.Screen name="FormNabung" component={FormNabung} options={{ title: ' ' }}  />
            <Stack.Screen name="FormBayarHutang" component={FormBayarHutang} options={{ title: ' ' }}  />
        </Stack.Navigator>
    )
}
