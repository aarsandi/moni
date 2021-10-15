import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFinance } from '../../store/finance/function';
import { fetchPlan } from '../../store/plan/function';
import { fetchHistPeng } from '../../store/historyPengeluaran/function';
import { useIsFocused } from "@react-navigation/native";

export default function Splash({navigation}) {
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const { nama, amountTabungan, amountDompet } = useSelector((state) => state.financeReducer)

    useEffect(() => {
        if(nama&&amountTabungan&&amountDompet) {
            navigation.navigate("AppScreenNavigator")
        }else{
            fetchFinance(dispatch, (el) => {
                if(el.message === "success") {
                    fetchPlan(dispatch)
                    fetchHistPeng(dispatch)
                    navigation.navigate("AppScreenNavigator")
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
