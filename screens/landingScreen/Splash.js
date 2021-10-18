import React, { useEffect } from 'react'
import { StyleSheet, Text, View, StatusBar } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFinance } from '../../store/finance/function';
import { fetchPlan } from '../../store/plan/function';
import { fetchHistPeng } from '../../store/historyPengeluaran/function';
import { useIsFocused } from "@react-navigation/native";

export default function Splash({navigation}) {
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const {isDarkMode} = useSelector((state) => state.appReducer)
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
        <View style={{ backgroundColor: isDarkMode, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar
                backgroundColor={isDarkMode}
                barStyle="dark-content"
            />
            <Text style={{ color: '#bee3db', fontSize:50 }}>...</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
