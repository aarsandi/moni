import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Sreens
import Plan from '../planScreen/Plan';
import SetupPlan from '../planScreen/SetupPlan';
import EditNeeds from '../planScreen/EditNeeds';

export default function PlanScreenNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Plan">
            <Stack.Screen name="Plan" component={Plan} options={{ title: 'Plan' }}  />
            <Stack.Screen name="SetupPlan" component={SetupPlan} options={{ title: 'Set Up Plan' }}  />
            <Stack.Screen name="EditNeeds" component={EditNeeds} options={{ title: ' ' }}  />
        </Stack.Navigator>
    )
}
