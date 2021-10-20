import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Setting from '../../screens/settingScreen/setting'
import Reset from '../../screens/settingScreen/Reset'
import EditFinance from '../../screens/settingScreen/EditFinance'

export default function SettingScreenNavigator() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Setting" screenOptions={{
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#14213d'
            }
        }}>
            <Stack.Screen name="Setting" component={Setting} options={{ title: 'Settings' }}  />
            <Stack.Screen name="EditFinance" component={EditFinance} options={{ title: 'Edit Finance' }}  />
            <Stack.Screen name="Reset" component={Reset} options={{ title: 'Reset' }}  />
        </Stack.Navigator>
    )
}
