import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'

import { fetchHistDom } from '../../store/historyActivityDompet/function'

export default function HistoryDompet() {
    const dispatch = useDispatch()
    const dataHistDom = useSelector((state) => state.historyActivityDompetReducer.allData)

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
            <Text>data history</Text>
            
            <View style={{marginVertical:10}}>
                {
                    dataHistDom&&dataHistDom.slice(0, 10).map((el, index) => {
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
