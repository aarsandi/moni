import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'

import { fetchHistPeng } from '../../store/historyPengeluaran/function'

export default function HistoryPengeluaran() {
    const dispatch = useDispatch()
    const dataHistPeng = useSelector((state) => state.historyPengeluaranReducer.allData)

    useEffect(() => {
        if(dataHistPeng===null) {
            fetchHistPeng(dispatch)
        }
    }, [])

    return (
        <View>
            <Text>data history</Text>
            
            <View style={{marginVertical:10}}>
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
