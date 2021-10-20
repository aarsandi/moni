import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { resetHistPeng } from '../../store/historyPengeluaran/function'
import { resetHistDom } from '../../store/historyActivityDompet/function'
import { resetHistDomCash } from '../../store/historyActivityDompetCash/function'
import { resetHistTab } from '../../store/historyActivityTabungan/function'
import { resetHistLoan } from '../../store/historyLoan/function'
import { resetPlan } from '../../store/plan/function'
import { useDispatch } from 'react-redux'

export default function Reset({navigation}) {
    const dispatch = useDispatch()
    return (
        <View style={{ padding: 10 }}>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20, borderBottomWidth: 2, borderColor:'#bee3db', paddingBottom: 10 }} onPress={() => {
                resetPlan(dispatch, _ => {
                    resetHistPeng(dispatch, _ => {
                        navigation.navigate("Splash")
                    })
                })
            }}>
                <Text style={styles.buttonTitle}>Reset Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20, borderBottomWidth: 2, borderColor:'#bee3db', paddingBottom: 10 }} onPress={() => {
                resetHistPeng(dispatch, _ => {
                    navigation.navigate("Splash")
                })
            }}>
                <Text style={styles.buttonTitle}>Reset History Pengeluaran</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20, borderBottomWidth: 2, borderColor:'#bee3db', paddingBottom: 10 }} onPress={() => {
                resetHistDom(dispatch, _ => {
                    navigation.navigate("Splash")
                })
            }}>
                <Text style={styles.buttonTitle}>Reset History Dompet Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20, borderBottomWidth: 2, borderColor:'#bee3db', paddingBottom: 10 }} onPress={() => {
                resetHistDomCash(dispatch, _ => {
                    navigation.navigate("Splash")
                })
            }}>
                <Text style={styles.buttonTitle}>Reset History Dompet Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20, borderBottomWidth: 2, borderColor:'#bee3db', paddingBottom: 10 }} onPress={() => {
                resetHistTab(dispatch, _ => {
                    navigation.navigate("Splash")
                })
            }}>
                <Text style={styles.buttonTitle}>Reset History Tabungan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20, borderBottomWidth: 2, borderColor:'#bee3db', paddingBottom: 10 }} onPress={() => {
                resetHistLoan(dispatch, _ => {
                    navigation.navigate("Splash")
                })
            }}>
                <Text style={styles.buttonTitle}>Reset History Loan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection:'row', paddingTop: 20, borderBottomWidth: 2, borderColor:'#bee3db', paddingBottom: 10 }} onPress={() => {
                resetFinance(dispatch, _ => {
                    resetPlan(dispatch, _ => {
                        resetHistPeng(dispatch, _ => {
                            navigation.navigate("Splash")
                        })
                    })
                })
            }}>
                <Text style={styles.buttonTitle}>Reset All</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonTitle : {
        fontWeight: '700', fontSize: 20, justifyContent: 'center', alignSelf: 'flex-start', flex:4
    }
})
