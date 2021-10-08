import React, {useEffect} from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { resetDataFinance } from '../../store/finance/function'
import { fetchPlan } from '../../store/plan/function'

export default function Plan({navigation}) {
    const dispatch = useDispatch()
    const { status,penghasilan,uangHarian,uangLainnya } = useSelector((state) => state.planReducer)

    useEffect(() => {
        if(penghasilan===null&&uangHarian===null&&uangLainnya===null) {
            fetchPlan(dispatch, (el) => {
                if(el.message === 500) {
                    Alert.alert( "Alert Title", "Error Function", [ { text: "Oke", style: "cancel", } ]);
                }
            })
        }
    }, [])

    return (
        <View>
            { !status?
                <>
                    <Text>Fitur Plan Anda Belum Aktif</Text>
                    <View style={{paddingVertical: 5}}>
                        <Button title="Setup Plan" onPress={() => navigation.navigate("SetupPlan")}/>
                    </View>
                </>:
                <>
                    <Text>nama: {penghasilan}</Text>
                    <Text>rek tabungan: {uangHarian}</Text>
                    <Text>rek dompet: {uangLainnya}</Text>

                    <View style={{paddingVertical: 5}}>
                        <Button title="Logout" onPress={() => resetDataFinance(dispatch, navigation)}/>
                    </View>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
