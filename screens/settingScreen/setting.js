import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { resetHistPeng } from '../../store/historyPengeluaran/function'
import { resetPlan } from '../../store/plan/function'
import { resetFinance, fetchFinance } from '../../store/finance/function'
import { useDispatch, useSelector } from 'react-redux'
import CompFormChangeAmount from '../../components/Form/CompFormChangeAmount'

export default function setting({navigation}) {
    const dispatch = useDispatch()
    const { amountDompet, amountRealDompet, amountTabungan } = useSelector((state) => state.financeReducer)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(amountDompet===null&&amountRealDompet===null) {
            fetchFinance(dispatch, (el) => {
                if(el.message === "success") {
                    setLoading(false)
                }else{
                    navigation.navigate("Splash")
                }
            })
        }else{
            setLoading(false)
        }
    }, [])

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

            <CompFormChangeAmount data={{amountDompet, amountRealDompet, amountTabungan}} navigation={navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({})
