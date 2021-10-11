import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { resetDataFinance } from '../../store/finance/function'
import { fetchPlan } from '../../store/plan/function'

export default function Plan({ navigation }) {
    const dispatch = useDispatch()
    const { status,type,uangTotal,jumlahDitabung,uangHarian,uangHariIni,tanggalGajian,pengeluaranBulanan } = useSelector((state) => state.planReducer)
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
        }else{
            setIsLoading(false)
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
                                <Text>uang Total: {uangTotal}</Text>
                                <Text>jumlah Ditabung: {jumlahDitabung}</Text>
                                <Text>batas Harian: {uangHarian}</Text>
                                <Text>pengeluaran hari ini: {uangHariIni}</Text>

                                <View style={{margin:10}}>
                                    <Text>Pengeluaran Bulanan: </Text>
                                    {
                                        pengeluaranBulanan.length?pengeluaranBulanan.map((el, index) => {
                                            return(
                                                <View key={index}>
                                                    <Text>{el.title} - {el.amount}</Text>
                                                </View>
                                            )
                                        }):
                                        <></>
                                    }
                                </View>
        
                                <View style={{paddingVertical: 5}}>
                                    <Button title="Edit Need" onPress={() => navigation.navigate('EditNeeds')}/>
                                </View>
                            </>:
                            <>
                                <Text>complete</Text>
                                {/* <Text>nama: {penghasilan}</Text>
                                <Text>rek tabungan: {uangHarian}</Text>
                                <Text>rek dompet: {uangLainnya}</Text> */}
                            </>
                        )
                    }
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({})
