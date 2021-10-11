import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { resetHistPeng } from '../../store/historyPengeluaran/function'
import { resetPlan } from '../../store/plan/function'
import { resetFinance } from '../../store/finance/function'
import { useDispatch } from 'react-redux' 

export default function setting({navigation}) {
    const dispatch = useDispatch()
    return (
        <View>
            <Text>Setting</Text>
            
            <View style={{paddingVertical: 5}}>
                <Button title="Reset Plan" onPress={() => {
                    resetPlan(dispatch, _ => {
                        resetHistPeng(dispatch, _ => {
                            navigation.navigate("Splash")
                        })
                    })
                }}/>
            </View>
            
            <View style={{paddingVertical: 5}}>
                <Button title="Reset History Pengeluaran" onPress={() => {
                    resetHistPeng(dispatch, _ => {
                        navigation.navigate("Splash")
                    })
                }}/>
            </View>
            
            <View style={{paddingVertical: 5}}>
                <Button title="Reset All" onPress={() => {
                    resetFinance(dispatch, _ => {
                        resetPlan(dispatch, _ => {
                            resetHistPeng(dispatch, _ => {
                                navigation.navigate("Splash")
                            })
                        })
                    })
                }}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
