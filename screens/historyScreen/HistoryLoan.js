import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'

import { fetchHistLoan } from '../../store/historyLoan/function'

export default function HistoryLoan() {
    const dispatch = useDispatch()
    const dataHistLoan = useSelector((state) => state.historyLoanReducer.allData)

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
            <Text>data history</Text>
            
            <View style={{marginVertical:10}}>
                {
                    dataHistLoan&&dataHistLoan.slice(0, 10).map((el, index) => {
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
