import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

export default function History({ navigation }) {
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
