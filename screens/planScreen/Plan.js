import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { resetDataFinance } from '../../store/finance/function'
import { fetchPlan } from '../../store/plan/function'

export default function Plan({ navigation }) {
    const dispatch = useDispatch()
    const { status,type } = useSelector((state) => state.planReducer)
    const [isLoading,setIsLoading] = useState(true)

    useEffect(() => {
        if(status===null&&type===null) {
            fetchPlan(dispatch, (el) => {
                if(el.message === "success") {
                    setIsLoading(false)
                }else{
                    navigation.navigate("Splash")
                }
            })
        }
    }, [])

    return (
        <View>
            {
                isLoading?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Loading</Text>
                </View>:
                <ScrollView contentInsetAdjustmentBehavior="automatic" >
                    { !status?
                        <>
                            <Text>Fitur Plan Anda Belum Aktif</Text>
                            <View style={{paddingVertical: 5}}>
                                <Button title="Setup Plan" onPress={() => navigation.navigate("SetupPlan")}/>
                            </View>
                        </>:
                        ( status==="active" ?
                            <>
                                <Text>active</Text>
                                {/* <Text>nama: {penghasilan}</Text>
                                <Text>rek tabungan: {uangHarian}</Text>
                                <Text>rek dompet: {uangLainnya}</Text> */}
        
                                <View style={{paddingVertical: 5}}>
                                    <Button title="Logout" onPress={() => resetDataFinance(dispatch, navigation)}/>
                                </View>
                            </>:
                            <>
                                <Text>complete</Text>
                                {/* <Text>nama: {penghasilan}</Text>
                                <Text>rek tabungan: {uangHarian}</Text>
                                <Text>rek dompet: {uangLainnya}</Text> */}
        
                                <View style={{paddingVertical: 5}}>
                                    <Button title="Logout" onPress={() => resetDataFinance(dispatch, navigation)}/>
                                </View>
                            </>
                        )
                    }
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
