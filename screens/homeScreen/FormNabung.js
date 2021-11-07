import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { inputNabung } from '../../store/app/function'
import { fetchPlan, updatePlan } from '../../store/plan/function';

import CompFormNabung from "../../components/Form/CompFormNabung"
import { leftDaysinMonth } from '../../helpers/calcDate'

export default function FormNabung({route, navigation}) {
    const dispatch = useDispatch()
    const { isPlan } = route.params;
    const { nama, amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status,uangTotal,type,jumlahDitabung,uangHarian,uangHariIni,tanggalGajian,pengeluaranBulanan } = useSelector((state) => state.planReducer)   
    
    const [ loading, setLoading ] = useState(true)
    const [dataFinance, setDataFinance] = useState({
        totalBulanan: 0,
        totalSisa: 0,
        jumlahDitabung: 0
    })

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
                }else if(isPlan&&dataFinance.totalSisa+dataFinance.jumlahDitabung<realAmount){
                    Alert.alert("Error", "Balance Plan tidak cukup", [], { cancelable:true })
                } else if(isPlan){
                    inputNabung(dispatch, result, (el) => {
                        if(el.message === "success") {
                            updatePlan(dispatch, {uangTotal: uangTotal-realAmount,jumlahDitabung: jumlahDitabung-result.amount}, (el) => {
                                if(el.message==="success"){
                                    navigation.navigate("Splash")
                                }else{
                                    Alert.alert("Error", "error function", [], { cancelable:true })
                                }
                            })
                        }else{
                            Alert.alert("Error", "Fungsi Error", [], { cancelable:true })
                        }
                    })
                } else {
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
        if(nama===null) {
            navigation.navigate("Splash")
        }else{
            fetchPlan(dispatch)
            if(status==="active") {
                if(isPlan) {
                    if(pengeluaranBulanan.length) {
                        const resTotBulanan = pengeluaranBulanan.reduce(function (accumulator, item) {
                            return accumulator + item.amount;
                        }, 0)
                        let calcFinance = {
                            totalBulanan: resTotBulanan,
                            totalSisa: 0,
                            jumlahDitabung: jumlahDitabung
                        }
                        const dateComp = type === "Payday" ? leftDaysinMonth(new Date(tanggalGajian)) : leftDaysinMonth()
                        const resultTotalHarian = (uangHarian*dateComp)+uangHariIni
                        calcFinance.totalSisa = uangTotal-(resultTotalHarian+jumlahDitabung+calcFinance.totalBulanan)
                        setDataFinance(calcFinance)
                    }else{
                        let calcFinance = {
                            totalBulanan: 0,
                            totalSisa: 0,
                            jumlahDitabung: jumlahDitabung
                        }
                        const dateComp = type === "Payday" ? leftDaysinMonth(new Date(tanggalGajian)) : leftDaysinMonth()
                        const resultTotalHarian = (uangHarian*dateComp)+uangHariIni
                        calcFinance.totalSisa = uangTotal-(resultTotalHarian+jumlahDitabung+calcFinance.totalBulanan)
                        setDataFinance(calcFinance)
                    }
                }
            }
            setLoading(false)
        }
    }, [])

    return (
        <View>
            {
                loading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 50 }}> ..... </Text>
                </View>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    {
                        isPlan?
                        <CompFormNabung data={{amountTabungan, amountDompet, amountRealDompet, uangTotal, jumlahDitabung:jumlahDitabung}} onSubmit={handleSubmit} navigation={navigation}/>:
                        <CompFormNabung data={{amountTabungan, amountDompet, amountRealDompet, uangTotal, jumlahDitabung:null}} onSubmit={handleSubmit} navigation={navigation}/>
                    }
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
