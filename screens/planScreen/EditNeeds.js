import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, ToastAndroid } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { updatePlan } from '../../store/plan/function'
import CompEditNeeds from '../../components/Form/CompEditNeeds'

export default function EditNeeds({ navigation }) {
    const dispatch = useDispatch()
    const { nama } = useSelector((state) => state.financeReducer)
    const { uangTotal, type, jumlahDitabung, uangHarian, uangHariIni, tanggalGajian, pengeluaranBulanan } = useSelector((state) => state.planReducer)

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
        if(nama===null) {
            navigation.navigate("Splash")
        }else{
            setLoading(false)
        }
    }, [])

    return (
        <View>
            { loading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 50 }}> ..... </Text>
                </View>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    <CompEditNeeds data={{ uangTotal, type, jumlahDitabung, uangHarian, uangHariIni, tanggalGajian, pengeluaranBulanan }} onSubmit={handleSubmit} navigation={navigation}/>
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
