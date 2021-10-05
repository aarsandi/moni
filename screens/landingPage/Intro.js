import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Button } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux'

export default function Intro({ navigation }) {
    const {isDarkMode} = useSelector((state) => state.dataReducer)

    return (
        <SafeAreaView style={isDarkMode ? Colors.darker : Colors.lighter}>
            <ScrollView contentInsetAdjustmentBehavior="automatic" style={isDarkMode ? Colors.darker : Colors.lighter}>
                <View style={{ backgroundColor: isDarkMode ? Colors.black : Colors.white, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text >Say good bye to snaky line</Text>
                    <Text >QME for Hospital</Text>
                    <Text >Help patients managing queue, no more time wasted standing in line.</Text>
                    <Button title="Register" onPress={() => navigation.navigate("Register")}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})
