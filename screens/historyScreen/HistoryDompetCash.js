import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'

import { fetchHistDomCash } from '../../store/historyActivityDompetCash/function'

export default function HistoryDompetCash() {
    const dispatch = useDispatch()
    const dataHistDomCash = useSelector((state) => state.historyActivityDompetCashReducer.allData)

    useEffect(() => {
        if(dataHistDomCash===null) {
            fetchHistDomCash(dispatch, (el) => {
                if(el.message !== "success") {
                    Alert.alert( "Alert Title", el.message, [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [dataHistDomCash])

    return (
        <View>
            <Text>data history</Text>
            
            <View style={{marginVertical:10}}>
                {
                    dataHistDomCash&&dataHistDomCash.slice(0, 10).map((el, index) => {
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
