import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'

import { fetchHistPeng } from '../../store/historyPengeluaran/function'
import { fetchHistTab } from '../../store/historyActivityTabungan/function'
import { fetchHistDom } from '../../store/historyActivityDompet/function'
import { fetchHistDomCash } from '../../store/historyActivityDompetCash/function'
import { fetchHistLoan } from '../../store/historyLoan/function'

export default function History({ navigation }) {
    const dispatch = useDispatch()

    const dataHistPeng = useSelector((state) => state.historyPengeluaranReducer.allData)
    const dataHistTab = useSelector((state) => state.historyActivityTabunganReducer.allData)
    const dataHistDom = useSelector((state) => state.historyActivityDompetReducer.allData)
    const dataHistDomCash = useSelector((state) => state.historyActivityDompetCashReducer.allData)
    const dataHistLoan = useSelector((state) => state.historyLoanReducer.allData)
    
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

    useEffect(() => {
        if(dataHistDomCash===null) {
            fetchHistDomCash(dispatch, (el) => {
                if(el.message !== "success") {
                    Alert.alert( "Alert Title", el.message, [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [dataHistDomCash])

    useEffect(() => {
        if(dataHistLoan===null) {
            fetchHistLoan(dispatch, (el) => {
                if(el.message !== "success") {
                    Alert.alert( "Alert Title", el.message, [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [dataHistLoan])

    return (
        <View>
            <Text>History Screen</Text>
            <View style={{marginVertical:10}}>
                <Button title="History Pengeluaran" onPress={() => {
                    navigation.navigate("HistoryPengeluaran")
                }} />
            </View>
            <View style={{marginVertical:10}}>
                <Button title="History Dompet" onPress={() => {
                    navigation.navigate("HistoryDompet")
                }} />
            </View>
            <View style={{marginVertical:10}}>
                <Button title="History Dompet Cash" onPress={() => {
                    navigation.navigate("HistoryDompetCash")
                }} />
            </View>
            <View style={{marginVertical:10}}>
                <Button title="History Tabungan" onPress={() => {
                    navigation.navigate("HistoryTabungan")
                }} />
            </View>
            <View style={{marginVertical:10}}>
                <Button title="History Pinjaman" onPress={() => {
                    navigation.navigate("HistoryLoan")
                }} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
