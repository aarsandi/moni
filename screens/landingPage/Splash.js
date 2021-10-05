import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfile } from '../../store/profile/function';
import { useIsFocused } from "@react-navigation/native";

export default function Splash({navigation}) {
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const { rekTabungan, rekDompet, email } = useSelector((state) => state.profileReducer)

    useEffect(() => {
        if(rekTabungan&&rekDompet&&email) {
            navigation.navigate("HomePageNavigator")
        }else{
            fetchProfile(dispatch, (el) => {
                if(el.message === "success") {
                    if(rekTabungan&&rekDompet&&email) {
                        navigation.navigate("HomePageNavigator")
                    }else{
                        navigation.navigate("Intro")
                    }
                }else{
                    navigation.navigate("Intro")
                }
            })
        }
    }, [isFocused])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Loading</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
