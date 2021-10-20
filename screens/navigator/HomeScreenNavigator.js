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
        <Stack.Navigator initialRouteName="Home" screenOptions={{
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#14213d'
            }
        }}>
            <Stack.Screen name="Home" component={Home} options={{ title: 'Moni' }}  />
            <Stack.Screen name="FormSpend" component={FormSpend} options={{ title: 'Form Pengeluaran' }}  />
            <Stack.Screen name="FormAmbilCash" component={FormAmbilCash} options={{ title: 'Form Ambil Cash' }}  />
            <Stack.Screen name="FormInputPenghasilan" component={FormInputPenghasilan} options={{ title: 'Form Penghasilan' }}  />
            <Stack.Screen name="FormLoan" component={FormLoan} options={{ title: 'Form Pinjaman' }}  />
            <Stack.Screen name="FormNabung" component={FormNabung} options={{ title: 'Form Nabung' }}  />
            <Stack.Screen name="FormBayarHutang" component={FormBayarHutang} options={{ title: 'Form Bayar Hutang' }}  />
        </Stack.Navigator>
    )
}
