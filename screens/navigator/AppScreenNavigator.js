import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from "@react-navigation/native";

// Sreens
import HomeScreenNavigator from "./HomeScreenNavigator"
import PlanScreenNavigator from "./PlanScreenNavigator"
import SettingScreen from "../settingScreen/setting"
import FinanceScreenNavigator from "./FinanceScreenNavigator"
import ReactNativeDoc from "../ReactNativeDoc"

export default function AppScreenNavigator({ navigation }) {
    const isFocused = useIsFocused();
    const Tab = createBottomTabNavigator();
    const { nama, amountTabungan, amountDompet } = useSelector((state) => state.financeReducer)

    useEffect(() => {
        if(!nama&&!amountTabungan&&!amountDompet) {
            navigation.navigate("Splash")
        }
    }, [isFocused])

    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
        
                    if (route.name === 'HomeScreenNavigator') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'PlanScreenNavigator') {
                        iconName = focused ? 'reader' : 'reader-outline';
                    } else if (route.name === 'SettingScreen') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'ReactNativeDoc') {
                        iconName = focused ? 'help-circle' : 'help-circle-outline';
                    }
        
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="HomeScreenNavigator" component={HomeScreenNavigator} options={{ title: 'Home', headerShown: false }} />
            <Tab.Screen name="PlanScreenNavigator" component={PlanScreenNavigator} options={{ title: 'Plan', headerShown: false }} />
            <Tab.Screen name="SettingScreen" component={SettingScreen} options={{ title: 'Setting' }} />
            <Tab.Screen name="ReactNativeDoc" component={ReactNativeDoc} options={{ title: 'React Native Doc' }} />
        </Tab.Navigator>
    )
}
