import React from 'react'
import { StyleSheet, Text, View, Button, Image, ImageBackground, StatusBar, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'

export default function Intro({ navigation }) {
    const {isDarkMode} = useSelector((state) => state.appReducer)

    return (
        <View style={{ backgroundColor: isDarkMode, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={ require('../../assets/financeVect.png') } style={ {  width: 300, height: 300 } } />
            <Text style={{ fontSize:40 }}>Moni</Text>
            <Text style={{ fontSize:15, marginBottom: 10 }}>Financial App</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ backgroundColor: '#31572c', padding: 10, borderRadius: 3 }}>
                <Text style={ { color: 'white' } }>Getting Started</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

})
