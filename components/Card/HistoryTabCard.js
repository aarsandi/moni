import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import moment from "moment"
import { toRupiah } from '../../helpers/NumberToString'

export default function HistoryTabCard({data}) {
    return (
        <View style={styles.container}>
            <View style={{flex:4}}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={{ fontSize:13, fontWeight:"300" }}>{moment(data.date).calendar()}</Text>
            </View>
            <View style={{flex:2, alignItems: 'flex-end' }}>
                <Text style={styles.title}>{toRupiah(data.amount, "Rp. ")}</Text>
                <Text style={{ fontSize:15, fontWeight:"800" }}>{data.type}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row', paddingBottom: 10, borderColor:'#8e9399', borderBottomWidth: 1
    },
    title: {
        fontSize:15, fontWeight:"600"
    }
})
