import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from "@react-navigation/native";

// Sreens
import HomeScreenNavigator from "./HomeScreenNavigator"
import PlanScreenNavigator from "./PlanScreenNavigator"
import SettingScreenNavigator from "./SettingScreenNavigator"
import HistoryScreenNavigator from "./HistoryScreenNavigator"

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
                    } else if (route.name === 'SettingScreenNavigator') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'HistoryScreenNavigator') {
                        iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
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
            <Tab.Screen name="HistoryScreenNavigator" component={HistoryScreenNavigator} options={{ title: 'History', headerShown: false }} />
            <Tab.Screen name="SettingScreenNavigator" component={SettingScreenNavigator} options={{ title: 'Setting', headerShown: false  }} />
        </Tab.Navigator>
    )
}
