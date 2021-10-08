import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { fetchPlan, resetPlan } from '../../store/plan/function'
import { fetchHistPeng, resetHistPeng } from '../../store/historyPengeluaran/function'
import { resetFinance } from '../../store/finance'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import {toRupiah} from '../../helpers/NumberToString'

export default function Home({ navigation }) {
    const dispatch = useDispatch()
    const { nama, amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status,penghasilan,jumlahDitabung,uangHarian,uangBulanan,uangLainnya,tanggalGajian,pengeluaranBulanan } = useSelector((state) => state.planReducer)
    const { allData } = useSelector((state) => state.historyPengeluaranReducer)
    
    useEffect(() => {
        if(penghasilan===null&&jumlahDitabung===null&&uangHarian===null) {
            fetchPlan(dispatch, (el) => {
                if(el.message === 500) {
                    Alert.alert( "Alert Title", "Error Function", [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [penghasilan, jumlahDitabung, uangHarian])

    useEffect(() => {
        if(allData===null) {
            fetchHistPeng(dispatch, (el) => {
                if(el.message === 500) {
                    Alert.alert( "Alert Title", "Error Function", [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [allData])

    return (
        <View>
            <Text>Selamat Datang {nama}</Text>
            { status?
                <View style={{paddingVertical: 20}}>
                    <Text>Uang Harian : {uangHarian}</Text>
                    <Text>Pengeluaran Bulanan: {uangBulanan}</Text>
                    <Text>Uang Sisa: {uangLainnya}</Text>
                </View>:
                <View style={{paddingVertical: 20}}>
                    <Text>Anda Belum mengaktifkan finansial plan</Text>
                    <Button title="Aktifkan" onPress={() => {
                        navigation.navigate("PlanScreenNavigator", { screen: 'SetupPlan' })
                    }} />
                </View>
            }
            <View style={{paddingVertical: 20}}>
                <Text>tabungan: {amountTabungan}</Text>
                <Text>uang rekening: {amountDompet}</Text>
                <Text>uang cash: {amountRealDompet}</Text>
            </View>
            
            <Button title="Input Pengeluaran" onPress={() => {
                navigation.navigate("FormSpend")
            }} />
            <View>
                {
                    allData&&allData.slice(0, 10).map((el, index) => {
                        return (
                            <Text key={index}>{el.type} - {el.title} - {toRupiah(el.amount, "Rp. ")} - {moment(el.date).format('lll')}</Text>
                        )
                    })
                }
            </View>
            
            <View style={{paddingVertical: 5}}>
                <Button title="Reset Data" onPress={() => {
                    resetFinance(dispatch, (el) => {
                        if(el.message === "success") {
                            resetPlan(dispatch, (el) => {
                                if(el.message === "success") {
                                    resetHistPeng(dispatch, (el) => {
                                        if(el.message === "success") {
                                            navigation.navigate("Splash")
                                        }
                                    })
                                }
                            })
                        }
                    })
                }}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
