import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'

import { fetchHistTab } from '../../store/historyActivityTabungan/function'

export default function HistoryTabungan() {
    const dispatch = useDispatch()
    const dataHistTab = useSelector((state) => state.historyActivityTabunganReducer.allData)

    useEffect(() => {
        if(dataHistTab===null) {
            fetchHistTab(dispatch)
        }
    }, [])
    return (
        <View>
            <Text>data history</Text>
            
            <View style={{marginVertical:10}}>
                {
                    dataHistTab&&dataHistTab.slice(0, 10).map((el, index) => {
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
