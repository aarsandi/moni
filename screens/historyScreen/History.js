import React, { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

export default function History({ navigation }) {
    const { nama } = useSelector((state) => state.financeReducer)

    useEffect(() => {
        if(nama===null) {
            navigation.navigate("Splash")
        }
    }, [])

    return (
        <View style={{ padding: 10 }}>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 10 }} onPress={() => navigation.navigate("HistoryPengeluaran")}>
                <Text style={styles.buttonTitle}>History Pengeluaran</Text>
                <Text style={{ flex:1, textAlign: 'right' }}><Ionicons name="chevron-forward" color="#31572c" size={30} /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20 }} onPress={() => navigation.navigate("HistoryDompet")}>
                <Text style={styles.buttonTitle}>History Dompet Account</Text>
                <Text style={{ flex:1, textAlign: 'right' }}><Ionicons name="chevron-forward" color="#31572c" size={30} /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20 }} onPress={() => navigation.navigate("HistoryDompetCash")}>
                <Text style={styles.buttonTitle}>History Dompet Cash</Text>
                <Text style={{ flex:1, textAlign: 'right' }}><Ionicons name="chevron-forward" color="#31572c" size={30} /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20 }} onPress={() => navigation.navigate("HistoryTabungan")}>
                <Text style={styles.buttonTitle}>History Saving Account</Text>
                <Text style={{ flex:1, textAlign: 'right' }}><Ionicons name="chevron-forward" color="#31572c" size={30} /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20 }} onPress={() => navigation.navigate("HistoryLoan")}>
                <Text style={styles.buttonTitle}>History Loan</Text>
                <Text style={{ flex:1, textAlign: 'right' }}><Ionicons name="chevron-forward" color="#31572c" size={30} /></Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonTitle : {
        fontWeight: '700', fontSize: 20, justifyContent: 'center', alignSelf: 'flex-start', flex:4
    }
})
