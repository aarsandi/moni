import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, ToastAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { updatePlan, fetchPlan } from '../../store/plan/function'
import { fetchFinance } from '../../store/finance/function'
import CompEditNeeds from '../../components/Form/CompEditNeeds'

export default function EditNeeds({ navigation }) {
    const dispatch = useDispatch()
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { uangTotal, jumlahDitabung, uangHarian, uangHariIni, tanggalGajian, pengeluaranBulanan } = useSelector((state) => state.planReducer)

    const [loading, setLoading] = useState(true)

    const handleSubmit = (val) => {
        updatePlan(dispatch, { pengeluaranBulanan: val.monthlyNeeds }, (el) => {
            if(el.message==="success") {
                navigation.navigate("Plan")
            }else{
                ToastAndroid.show('error function', ToastAndroid.SHORT)
            }
        })
    }

    useEffect(() => {
        if(amountTabungan===null, amountDompet===null, amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message==="success") {
                    fetchPlan(dispatch)
                    setLoading(false)
                }else{
                    navigation.navigate("Splash")
                }
            })
        }else{
            setLoading(false)
        }
    }, [])

    return (
        <View>
            { loading?
                <Text>Loading...</Text>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    <CompEditNeeds data={{ uangTotal, jumlahDitabung, uangHarian, uangHariIni, tanggalGajian, pengeluaranBulanan }} onSubmit={handleSubmit} navigation={navigation}/>
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
