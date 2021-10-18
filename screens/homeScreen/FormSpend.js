import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { leftDaysinMonth } from '../../helpers/calcDate'

import { useIsFocused } from "@react-navigation/native";
import { inputPengeluaran } from '../../store/app/function'
import { fetchFinance } from '../../store/finance/function'
import { fetchPlan, updatePlan } from '../../store/plan/function';

import CompFormSpend from '../../components/Form/CompFormSpend';

export default function FormSpend({ navigation }) {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const [ loading, setLoading ] = useState(true)
    const { amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status,uangTotal,jumlahDitabung,uangHarian,uangHariIni,tanggalGajian,pengeluaranBulanan } = useSelector((state) => state.planReducer)

    const [dataFinance, setDataFinance] = useState({
        totalBulanan: 0,
        totalSisa: 0,
        totalHarian: 0,
        sisaHari: 0,
        jumlahDitabung: 0,
        uangTotal: 0
    })

    const handleSubmit = (val) => {
        Alert.alert("Info", "are you sure?", [{
            text: "Ok",
            onPress: () => {
                const result = {...val, amountTabungan: amountTabungan, amountDompet: amountDompet, amountRealDompet: amountRealDompet}
                
                let resultPlan
                const tempAmount = result.amount+result.tax
                if(result.type==="Bulanan"){
                    if(result.selectedPengBul) {
                        inputPengeluaran(dispatch, result, (el) => {
                            if(el.message === "success") {                                
                                if(status==="active"&&result.payWith!=="Rekening Tabungan"){
                                    resultPlan={
                                        uangTotal:uangTotal-tempAmount,
                                        pengeluaranBulanan:pengeluaranBulanan.filter(el => el.id !== result.selectedPengBul.id)
                                    }
                                    updatePlan(dispatch, resultPlan, (el) => {
                                        if(el.message==="success"){
                                            navigation.navigate("Splash")
                                        }else{
                                            Alert.alert("Error", "error function", [], { cancelable:true })
                                        }
                                    })
                                }else{
                                    navigation.navigate("Splash")
                                }
                            } else {
                                Alert.alert("Error", "error function", [], { cancelable:true })
                            }
                        })
                    }else{
                        Alert.alert("Error", "Pilih Item Terlebih Dahulu", [], { cancelable:true })
                    }
                }else if(result.type==="Harian"){
                    if(status==="active" && (uangHariIni+tempAmount)>uangHarian){
                        Alert.alert("Warning", "anda sudah melebihi batas harian, apakah anda yakin ?", [{
                            text: "Ok",
                            onPress: () => {
                                inputPengeluaran(dispatch, result, (el) => {
                                    if(el.message === "success") {
                                        if(status==="active"&&result.payWith!=="Rekening Tabungan"){
                                            resultPlan={
                                                uangTotal:uangTotal-tempAmount,
                                                uangHariIni:uangHariIni+tempAmount
                                            }
                                            updatePlan(dispatch, resultPlan, (el) => {
                                                if(el.message==="success"){
                                                    navigation.navigate("Splash")
                                                }else{
                                                    Alert.alert("Error", "error function", [], { cancelable:true })
                                                }
                                            })
                                        }else{
                                            navigation.navigate("Splash")
                                        }
                                    } else {
                                        Alert.alert("Error", "error function", [], { cancelable:true })
                                    }
                                })
                            },
                            style: "ok",
                        }], { cancelable:true })
                    }else{
                        inputPengeluaran(dispatch, result, (el) => {
                            if(el.message === "success") {
                                if(status==="active"&&result.payWith!=="Rekening Tabungan"){
                                    resultPlan={
                                        uangTotal:uangTotal-tempAmount,
                                        uangHariIni:uangHariIni+tempAmount
                                    }
                                    updatePlan(dispatch, resultPlan, (el) => {
                                        if(el.message==="success"){
                                            navigation.navigate("Splash")
                                        }else{
                                            Alert.alert("Error", "error function", [], { cancelable:true })
                                        }
                                    })
                                }else{
                                    navigation.navigate("Splash")
                                }
                            } else {
                                Alert.alert("Error", "error function", [], { cancelable:true })
                            }
                        })
                    }                  
                }else if(result.type==="Lainnya"){
                    inputPengeluaran(dispatch, result, (el) => {
                        if(el.message === "success") {
                            if(status==="active"&&result.payWith!=="Rekening Tabungan"){
                                resultPlan={
                                    uangTotal:uangTotal-tempAmount
                                }
                                updatePlan(dispatch, resultPlan, (el) => {
                                    if(el.message==="success"){
                                        navigation.navigate("Splash")
                                    }else{
                                        Alert.alert("Error", "error function", [], { cancelable:true })
                                    }
                                })
                            }else{
                                navigation.navigate("Splash")
                            }
                        } else {
                            Alert.alert("Error", "error function", [], { cancelable:true })
                        }
                    })
                }else{
                    Alert.alert("Error", "tipe pengeluaran tidak terdaftar", [], { cancelable:true })
                }
            },
            style: "ok",
        }], { cancelable:true })
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

    useEffect(() => {
        if(status) {
            if(pengeluaranBulanan.length) {
                const resTotBulanan = pengeluaranBulanan.reduce(function (accumulator, item) {
                    return accumulator + item.amount;
                }, 0)
                let calcFinance = {
                    totalBulanan: resTotBulanan,
                    totalSisa: 0,
                    totalHarian: 0,
                    sisaHari: 0,
                    jumlahDitabung: jumlahDitabung,
                    uangTotal: uangTotal,
                    tanggalGajian: tanggalGajian
                }
                const resultTotalHarian = (uangHarian*leftDaysinMonth(new Date(tanggalGajian)))+uangHariIni
                calcFinance.sisaHari = leftDaysinMonth(new Date(tanggalGajian))+1
                calcFinance.totalHarian = resultTotalHarian
                calcFinance.totalSisa = uangTotal-(resultTotalHarian+jumlahDitabung+calcFinance.totalBulanan)
                setDataFinance(calcFinance)
            }else{
                let calcFinance = {
                    totalBulanan: 0,
                    totalSisa: 0,
                    totalHarian: 0,
                    sisaHari: 0,
                    jumlahDitabung: jumlahDitabung,
                    uangTotal: uangTotal,
                    tanggalGajian: tanggalGajian
                }
                const resultTotalHarian = (uangHarian*leftDaysinMonth(new Date(tanggalGajian)))+uangHariIni
                calcFinance.sisaHari = leftDaysinMonth(new Date(tanggalGajian))+1
                calcFinance.totalHarian = resultTotalHarian
                calcFinance.totalSisa = uangTotal-(resultTotalHarian+jumlahDitabung+calcFinance.totalBulanan)
                setDataFinance(calcFinance)
            }
        }
    }, [isFocused])

    return (
        <View>
            {
                loading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Loading</Text>
                </View>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    <CompFormSpend data={{ amountTabungan, amountDompet, amountRealDompet, status, pengeluaranBulanan,
                        planBulanan: dataFinance.totalBulanan+dataFinance.totalSisa,
                        planHarian: dataFinance.totalHarian+dataFinance.totalSisa,
                        planLainnya: dataFinance.totalSisa
                    }} onSubmit={handleSubmit} navigation={navigation}/>
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
});
