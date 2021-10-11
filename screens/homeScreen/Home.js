import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'

import { fetchPlan } from '../../store/plan/function'
import { fetchHistPeng } from '../../store/historyPengeluaran/function'
import { fetchHistTab } from '../../store/historyActivityTabungan/function'
import { fetchHistDom } from '../../store/historyActivityDompet/function'
import { fetchFinance } from '../../store/finance/function'

export default function Home({ navigation }) {
    const dispatch = useDispatch()
    const { nama, amountTabungan, amountDompet, amountRealDompet } = useSelector((state) => state.financeReducer)
    const { status,type,uangTotal,jumlahDitabung,uangHarian,uangHariIni,tanggalGajian,pengeluaranBulanan } = useSelector((state) => state.planReducer)
    const dataHistPeng = useSelector((state) => state.historyPengeluaranReducer.allData)
    const dataHistTab = useSelector((state) => state.historyActivityTabunganReducer.allData)
    const dataHistDom = useSelector((state) => state.historyActivityDompetReducer.allData)

    // console.log(dataHistPeng)
    // console.log(status,type,uangTotal,jumlahDitabung,uangHarian,uangHariIni,tanggalGajian,pengeluaranBulanan)
    // console.log(dataHistDom)
    
    useEffect(() => {
        if(status===null&&type===null&&uangHariIni===null) {
            fetchPlan(dispatch, (el) => {
                if(el.message !== "success") {
                    Alert.alert( "Alert Title", el.message, [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [status, type, uangHariIni])
    
    useEffect(() => {
        if(dataHistPeng===null) {
            fetchHistPeng(dispatch, (el) => {
                if(el.message !== "success") {
                    Alert.alert( "Alert Title", el.message, [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [dataHistPeng])

    useEffect(() => {
        if(dataHistTab===null) {
            fetchHistTab(dispatch, (el) => {
                if(el.message !== "success") {
                    Alert.alert( "Alert Title", el.message, [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [dataHistTab])

    useEffect(() => {
        if(dataHistDom===null) {
            fetchHistDom(dispatch, (el) => {
                if(el.message !== "success") {
                    Alert.alert( "Alert Title", el.message, [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [dataHistDom])

    return (
        <View>
            <Text>Selamat Datang {nama}</Text>
            { status?
                <View style={{paddingVertical: 20}}>
                    <Text>status : {status}</Text>
                    <Text>Uang Total: {uangTotal}</Text>
                    <Text>Batas Harian: {uangHarian}</Text>
                    <Text>Uang Hariini: {uangHariIni}</Text>
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

            <View style={{marginVertical:10}}>
                <Button title="Ambil Cash" onPress={() => {
                    navigation.navigate("FormAmbilCash")
                }} />
            </View>
            
            <Button title="Input Pengeluaran" onPress={() => {
                navigation.navigate("FormSpend")
            }} />
            <View>
                {
                    dataHistPeng&&dataHistPeng.slice(0, 10).map((el, index) => {
                        return (
                            <Text key={index}>{el.type} - {el.title} - {toRupiah(el.amount, "Rp. ")} - {moment(el.date).format('lll')}</Text>
                        )
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
