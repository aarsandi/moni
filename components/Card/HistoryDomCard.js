import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'

export default function HistoryDomCard({ data }) {
    return (
        <View style={{flexDirection:'row', paddingTop: 10, paddingBottom: 5, borderColor:'#8e9399', borderBottomWidth: 1}}>
            <View style={{flex:4}}>
                <Text style={{ fontSize:15, fontWeight:"600" }}>{data.title}</Text>
                <Text style={{ fontSize:13, fontWeight:"300" }}>{moment(data.date).calendar()}</Text>
            </View>
            <View style={{flex:2, alignItems: 'flex-end' }}>
                <Text style={{ fontSize:15, fontWeight:"600" }}>{toRupiah(data.amount, "Rp. ")}</Text>
                <Text style={{ fontSize:15, fontWeight:"800" }}>{data.type}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
