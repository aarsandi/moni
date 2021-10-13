import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Button, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { toRupiah } from '../../helpers/NumberToString'

import { inputNabung } from '../../store/app/function'
import { fetchPlan, updatePlan } from '../../store/plan/function';
import { fetchFinance } from '../../store/finance/function'

import CompFormNabung from "../../components/Form/CompFormNabung"

export default function FormNabung({route, navigation}) {
    const dispatch = useDispatch()
    const { isPlan } = route.params;
    const { nama, amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status, uangTotal, jumlahDitabung } = useSelector((state) => state.planReducer)
    

    const handleSubmit = (val) => {
        Alert.alert("Info", "are you sure?", [{
            text: "Ok",
            onPress: () => {
                const result = {...val, title: isPlan?"Nabung Bulanan":"Nabung", amountTabungan: amountTabungan, amountDompet: amountDompet, amountRealDompet: amountRealDompet}
                const realAmount = result.amount+result.taxPengirim
                if(result.type==="Rekening"&&amountDompet<realAmount) {
                    Alert.alert("Error", "Balance tidak cukup", [], { cancelable:true })
                }else if(result.type==="Cash"&&amountRealDompet<realAmount){
                    Alert.alert("Error", "Balance tidak cukup", [], { cancelable:true })
                }else {
                    inputNabung(dispatch, result, (el) => {
                        if(el.message === "success") {
                            navigation.navigate("Splash")
                        }else{
                            Alert.alert("Error", "Fungsi Error", [], { cancelable:true })
                        }
                    })
                }
            },
            style: "ok",
        }], { cancelable:true })
    }
    
    useEffect(() => {
        if(nama===null&&amountDompet===null&&amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message !== "success") {
                    navigation.navigate("Splash")
                }
            })
        }
    }, [])

    useEffect(() => {
        if(uangTotal===null) {
            fetchPlan(dispatch, (el) => {
                if(el.message !== "success") {
                    navigation.navigate("Splash")
                }
            })
        }
    }, [])

    return (
        <View>
            <ScrollView contentInsetAdjustmentBehavior="automatic" >
                <Text style={ { fontSize: 20, fontWeight: 'bold' } }>Form Nabung</Text>
                <Text>Tabungan anda sekarang: {toRupiah(amountTabungan, "Rp. ")}</Text>
                <Text>Uang Total Plan anda sekarang: {toRupiah(uangTotal, "Rp. ")}</Text>
                {
                    isPlan?
                    <CompFormNabung data={{amountTabungan, amountDompet, amountRealDompet, uangTotal, jumlahDitabung:jumlahDitabung}} onSubmit={handleSubmit} navigation={navigation}/>:
                    <CompFormNabung data={{amountTabungan, amountDompet, amountRealDompet, uangTotal, jumlahDitabung:null}} onSubmit={handleSubmit} navigation={navigation}/>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
