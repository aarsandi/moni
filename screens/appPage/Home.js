import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {useSelector} from 'react-redux'

export default function Home({navigation}) {
    const {rekTabungan, rekDompet, email} = useSelector((state) => state.profileReducer)

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
